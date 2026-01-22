import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { blackBoardSquares, boardSquares } from "../assets/boardSquares";
import { supabase } from "../assets/supabaseClient";
import { formatTime } from "../assets/formatTime";
import { botPlayer } from "../assets/botPlayer";
import { onPieceDrop } from "../assets/onPieceDrop";
import Board from "../components/chess/Board";
import PlayerCard from "../components/PlayerCard";
import MoveHistory from "../components/MoveHistory";
import GameOverModal from "../components/GameOverModal";
import GameChat from "../components/GameChat";

function Match() {
  const { id: matchId } = useParams();
  const isBotMatch = !matchId;
  const navigate = useNavigate();
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;
  const gameEndProcessedRef = useRef(false);
  const timeLossProcessedRef = useRef(false);
  const channelRef = useRef(null);
  const ratingsUpdatedRef = useRef(false);
  const [userId, setUserId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  // Server-authoritative match clock state
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [activeColorServer, setActiveColorServer] = useState(null); // 'w' | 'b'
  const [clockStartedAt, setClockStartedAt] = useState(null); // ISO string
  const [matchStatus, setMatchStatus] = useState(null);
  const [matchWinnerId, setMatchWinnerId] = useState(null);
  const [clockTick, setClockTick] = useState(0); // drives re-render while ticking
  const matchMetaChannelRef = useRef(null);
  const [boardPieces, setBoardPieces] = useState(() =>
    boardSquares.map((square) => chess.get(square)),
  );

  const boardLayout = useMemo(
    () => (playerColor === "b" ? blackBoardSquares : boardSquares),
    [playerColor],
  );

  const syncBoard = useCallback(() => {
    setBoardPieces(boardLayout.map((square) => chess.get(square)));
  }, [boardLayout, chess]);

  const applyMoves = useCallback(
    (moves) => {
      chess.reset();

      moves.forEach(({ move }) => {
        chess.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion ?? "q",
        });
      });

      syncBoard();
      setMoveHistory(chess.history({ verbose: true }));
    },
    [chess, syncBoard],
  );

  const handleMove = useCallback(
    ({ to, from, promotion = "q" }) => {
      const result = chess.move({
        from,
        to,
        promotion,
      });

      if (result) {
        syncBoard();
        setMoveHistory(chess.history({ verbose: true }));
      }
    },
    [chess, syncBoard],
  );

  //sync board on layout change
  useEffect(() => {
    syncBoard();
  }, [boardLayout, syncBoard]);

  //get userid
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
    window.scrollTo(0, 0);
  }, []);

  //setup bot match
  useEffect(() => {
    if (!isBotMatch || !userId) return;

    const setupBotMatch = async () => {
      const { data: profile } = await supabase
        .from("users")
        .select("id, username, avatar_url, rating")
        .eq("id", userId)
        .single();

      setWhitePlayer(profile);
      setBlackPlayer(botPlayer);
      setPlayerColor("w");
    };

    setupBotMatch();
  }, [isBotMatch, userId]);

  //bot match logic
  useEffect(() => {
    if (!isBotMatch || chess.turn() !== "b" || chess.isGameOver()) return;

    const timeout = setTimeout(() => {
      const moves = chess.moves();
      if (moves.length === 0) return;

      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      chess.move(randomMove);
      syncBoard();
      setMoveHistory(chess.history({ verbose: true }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [isBotMatch, chess, syncBoard, boardPieces]);

  // Drive local UI ticking for the active player's clock
  useEffect(() => {
    if (!matchId || gameOver || !activeColorServer || !clockStartedAt) return;
    const interval = setInterval(() => {
      setClockTick((t) => (t + 1) % 1000000);
    }, 500);
    return () => clearInterval(interval);
  }, [matchId, gameOver, activeColorServer, clockStartedAt]);

  useEffect(() => {
    if (gameEndProcessedRef.current) return;
    if (!chess.isGameOver()) return;

    gameEndProcessedRef.current = true;

    const result = chess.isCheckmate()
      ? chess.turn() === "w"
        ? "b"
        : "w"
      : null;
    setWinner(result);
    setGameOver(true);

    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (err) {
        console.log(err);
      }
      channelRef.current = null;
    }
  }, [moveHistory.length, chess]);

  useEffect(() => {
    if (!gameOver || ratingsUpdatedRef.current) return;
    if (!winner || !userId) return;
    ratingsUpdatedRef.current = true;

    const applyRatings = async () => {
      const result = winner; // 'w' or 'b'
      try {
        if (isBotMatch) {
          const playerWon = result === playerColor;
          const ratingChange = playerWon ? 5 : -10;
          const currentRating = whitePlayer?.rating ?? 1200;
          const newRating = Math.max(100, currentRating + ratingChange);
          await supabase
            .from("users")
            .update({ rating: newRating })
            .eq("id", userId);
        } else if (matchId) {
          const winnerId = result === "w" ? whitePlayer?.id : blackPlayer?.id;
          const loserId = result === "w" ? blackPlayer?.id : whitePlayer?.id;
          if (winnerId && loserId) {
            await supabase
              .from("users")
              .update({
                rating:
                  whitePlayer?.id === winnerId
                    ? (whitePlayer?.rating ?? 1200) + 20
                    : (blackPlayer?.rating ?? 1200) + 20,
              })
              .eq("id", winnerId);

            await supabase
              .from("users")
              .update({
                rating:
                  whitePlayer?.id === loserId
                    ? Math.max(100, (whitePlayer?.rating ?? 1200) - 15)
                    : Math.max(100, (blackPlayer?.rating ?? 1200) - 15),
              })
              .eq("id", loserId);

            await supabase
              .from("matches")
              .update({ status: "done", winner: winnerId })
              .eq("id", matchId);
          }
        }
      } catch (err) {
        console.error("Failed to update ratings:", err);
      }
    };

    applyRatings();
  }, [
    gameOver,
    winner,
    userId,
    isBotMatch,
    matchId,
    playerColor,
    whitePlayer,
    blackPlayer,
  ]);

  useEffect(() => {
    if (!matchId || !userId) return;

    const fetchMatchAndPlayers = async () => {
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select(
          "white_player, black_player, white_time_seconds, black_time_seconds, active_color, clock_started_at, status, winner",
        )
        .eq("id", matchId)
        .single();

      if (matchError || !matchData) {
        console.error("Failed to load match", matchError);
        return;
      }

      const playerIds = [matchData.white_player, matchData.black_player];

      const { data: profiles, error: profilesError } = await supabase
        .from("users")
        .select("id, username, avatar_url, rating")
        .in("id", playerIds);

      if (profilesError) {
        console.error("Failed to load player profiles", profilesError);
      } else {
        setWhitePlayer(profiles.find((p) => p.id === matchData.white_player));
        setBlackPlayer(profiles.find((p) => p.id === matchData.black_player));
      }

      if (matchData.white_player === userId) {
        setPlayerColor("w");
      } else if (matchData.black_player === userId) {
        setPlayerColor("b");
      } else {
        setPlayerColor(null);
      }

      // Initialize server clock state
      setWhiteTime(matchData.white_time_seconds ?? 600);
      setBlackTime(matchData.black_time_seconds ?? 600);
      setActiveColorServer(matchData.active_color ?? null);
      setClockStartedAt(matchData.clock_started_at ?? null);
      setMatchStatus(matchData.status ?? null);
      setMatchWinnerId(matchData.winner ?? null);

      const { data: existingMoves, error: movesError } = await supabase
        .from("match_moves")
        .select("move")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (movesError) {
        console.error("Failed to load moves", movesError);
        return;
      }

      applyMoves(existingMoves ?? []);
    };

    fetchMatchAndPlayers();
  }, [matchId, userId, applyMoves]);

  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`match_moves_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_moves",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          handleMove(payload.new.move);
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [matchId, playerColor, handleMove]);

  // Subscribe to match meta updates (clocks, status, winner)
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`match_meta_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          const m = payload.new;
          setWhiteTime(m.white_time_seconds ?? 600);
          setBlackTime(m.black_time_seconds ?? 600);
          setActiveColorServer(m.active_color ?? null);
          setClockStartedAt(m.clock_started_at ?? null);
          setMatchStatus(m.status ?? null);
          setMatchWinnerId(m.winner ?? null);
        },
      )
      .subscribe();

    matchMetaChannelRef.current = channel;
    return () => {
      if (matchMetaChannelRef.current) {
        supabase.removeChannel(matchMetaChannelRef.current);
        matchMetaChannelRef.current = null;
      }
    };
  }, [matchId]);

  // Reflect server-declared game over (e.g., timeout)
  useEffect(() => {
    if (!matchId) return;
    if (gameEndProcessedRef.current) return;
    if (matchStatus === "done" && matchWinnerId) {
      gameEndProcessedRef.current = true;
      setGameOver(true);
      const winColor =
        matchWinnerId === whitePlayer?.id
          ? "w"
          : matchWinnerId === blackPlayer?.id
            ? "b"
            : null;
      setWinner(winColor);
    }
  }, [matchId, matchStatus, matchWinnerId, whitePlayer, blackPlayer]);

  // Compute display times based on server state
  const whiteRemaining = useMemo(() => {
    if (activeColorServer === "w" && clockStartedAt) {
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - new Date(clockStartedAt).getTime()) / 1000),
      );
      return Math.max(0, (whiteTime ?? 0) - elapsed);
    }
    return whiteTime ?? 0;
  }, [whiteTime, activeColorServer, clockStartedAt, clockTick]);

  const blackRemaining = useMemo(() => {
    if (activeColorServer === "b" && clockStartedAt) {
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - new Date(clockStartedAt).getTime()) / 1000),
      );
      return Math.max(0, (blackTime ?? 0) - elapsed);
    }
    return blackTime ?? 0;
  }, [blackTime, activeColorServer, clockStartedAt, clockTick]);

  // Client-side failsafe: if either clock hits zero, mark game over
  useEffect(() => {
    if (isBotMatch) return;
    if (!matchId || gameOver) return;
    if (timeLossProcessedRef.current) return;

    const whiteFlag = whiteRemaining === 0;
    const blackFlag = blackRemaining === 0;
    if (!whiteFlag && !blackFlag) return;

    timeLossProcessedRef.current = true;
    const loserColor = whiteFlag ? "w" : "b";
    const winnerColor = loserColor === "w" ? "b" : "w";
    const winnerId = winnerColor === "w" ? whitePlayer?.id : blackPlayer?.id;

    setGameOver(true);
    setWinner(winnerColor);

    if (winnerId) {
      const updateTimeout = async () => {
        try {
          const { error } = await supabase
            .from("matches")
            .update({ status: "done", winner: winnerId })
            .eq("id", matchId);

          if (error) {
            console.error("Failed to mark timeout", error);
          }
        } catch (err) {
          console.error("Failed to mark timeout", err);
        }
      };
      updateTimeout();
    }
  }, [
    isBotMatch,
    matchId,
    gameOver,
    whiteRemaining,
    blackRemaining,
    whitePlayer,
    blackPlayer,
  ]);

  return (
    <div className="min-h-screen w-screen bg-[#F4E9CD] flex items-center justify-center p-4">
      {gameOver && (
        <GameOverModal
          winner={winner}
          playerColor={playerColor}
          onNavigate={() => navigate("/dashboard")}
          isBotMatch={isBotMatch}
        />
      )}
      <div className="w-full max-w-[100rem] grid grid-cols-1 lg:grid-cols-[300px_auto_300px] gap-4 lg:gap-8 items-start">
        <div className="lg:order-1 order-2 flex flex-col gap-4 max-h-[44rem] h-full min-h-[32rem]">
          <PlayerCard
            player={playerColor === "w" ? blackPlayer : whitePlayer}
            isActiveTurn={chess.turn() === (playerColor === "w" ? "b" : "w")}
            clockDisplay={
              !isBotMatch
                ? playerColor === "w"
                  ? formatTime(blackRemaining)
                  : formatTime(whiteRemaining)
                : null
            }
          />
          <MoveHistory moves={moveHistory} />
          <PlayerCard
            player={playerColor === "w" ? whitePlayer : blackPlayer}
            isActiveTurn={chess.turn() === playerColor}
            clockDisplay={
              !isBotMatch
                ? playerColor === "w"
                  ? formatTime(whiteRemaining)
                  : formatTime(blackRemaining)
                : null
            }
          />
        </div>
        <div className="flex items-center justify-center lg:order-2 order-1">
          <Board
            board={boardLayout}
            pieces={boardPieces}
            chess={chess}
            onPieceDrop={onPieceDrop}
            playerColor={playerColor}
            isBotMatch={isBotMatch}
            matchId={matchId}
            userId={userId}
            supabase={supabase}
            syncBoard={syncBoard}
            setMoveHistory={setMoveHistory}
          />
        </div>
        <div className="lg:order-3 order-3">
          <GameChat matchId={matchId} userId={userId} isBotMatch={isBotMatch} />
        </div>
      </div>
    </div>
  );
}

export default Match;

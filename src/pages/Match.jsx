import { Chess } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../assets/supabaseClient";
import Board from "../components/chess/Board";
import PlayerCard from "../components/PlayerCard";
import MoveHistory from "../components/MoveHistory";
import GameOverModal from "../components/GameOverModal";
import { blackBoardSquares, boardSquares } from "../assets/boardSquares";
import { Clock } from "lucide-react";
import { formatTime } from "../assets/formatTime";
import { botPlayer } from "../assets/botPlayer";

function Match() {
  const { id: matchId } = useParams();
  const navigate = useNavigate();

  const chessRef = useRef(new Chess());
  const chess = chessRef.current;
  const gameEndProcessedRef = useRef(false);
  const channelRef = useRef(null);
  const ratingsUpdatedRef = useRef(false);

  const [boardPieces, setBoardPieces] = useState(() =>
    boardSquares.map((square) => chess.get(square))
  );
  const [userId, setUserId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [matchTime, setMatchTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timerActive, setTimerActive] = useState(true);
  const isBotMatch = !matchId;

  const boardLayout = useMemo(
    () => (playerColor === "b" ? blackBoardSquares : boardSquares),
    [playerColor]
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
    [chess, syncBoard]
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
    [chess, syncBoard]
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // Bot match setup
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

  // Match timer
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setMatchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  // Detect game over right after a move is recorded
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
    setTimerActive(false);

    // Stop realtime subscription to avoid extra traffic/errors
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (err) {
        console.log(err);
      }
      channelRef.current = null;
    }
  }, [moveHistory.length, chess]);

  // Update ratings once, after UI reflects game over
  useEffect(() => {
    if (!gameOver || ratingsUpdatedRef.current) return;
    if (!winner || !userId) return;
    ratingsUpdatedRef.current = true;

    const applyRatings = async () => {
      const result = winner; // 'w' or 'b'
      try {
        if (isBotMatch) {
          const playerWon = result === playerColor;
          const ratingChange = playerWon ? 30 : -20;
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
                    ? (whitePlayer?.rating ?? 1200) + 30
                    : (blackPlayer?.rating ?? 1200) + 30,
              })
              .eq("id", winnerId);

            await supabase
              .from("users")
              .update({
                rating:
                  whitePlayer?.id === loserId
                    ? Math.max(100, (whitePlayer?.rating ?? 1200) - 20)
                    : Math.max(100, (blackPlayer?.rating ?? 1200) - 20),
              })
              .eq("id", loserId);
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
        .select("white_player, black_player")
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
    syncBoard();
  }, [boardLayout, syncBoard]);

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
        }
      )
      .subscribe();

    // Keep a reference so we can close when game ends
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [matchId, playerColor, handleMove]);

  const onPieceDrop = async (from, to) => {
    // Bot match logic
    if (isBotMatch) {
      if (chess.turn() !== "w") return false;

      const move = chess.move({
        from,
        to,
        promotion: "q",
      });

      if (!move) return false;

      syncBoard();
      setMoveHistory(chess.history({ verbose: true }));
      return true;
    }

    // Online match logic
    if (!matchId || !userId || !playerColor) return false;

    if (chess.turn() !== playerColor) return false;

    const piece = chess.get(from);
    if (!piece || piece.color !== playerColor) return false;

    const move = chess.move({
      from,
      to,
      promotion: "q",
    });

    if (!move) return false;

    chess.undo();

    const { error } = await supabase.from("match_moves").insert({
      match_id: matchId,
      player_id: userId,
      move: {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      },
    });

    if (error) {
      console.error("Failed to send move", error);
      return false;
    }

    return true;
  };

  return (
    <div className="min-h-screen w-screen bg-[#F4E9CD] flex items-center justify-center p-4">
      {gameOver && (
        <GameOverModal
          winner={winner}
          playerColor={playerColor}
          onNavigate={() => navigate("/dashboard")}
        />
      )}
      <div className="w-full max-w-[100rem] grid grid-cols-1 lg:grid-cols-[280px_auto_280px] gap-4 lg:gap-8 items-start">
        <div className="space-y-4 lg:order-1 order-2">
          <PlayerCard
            player={playerColor === "w" ? blackPlayer : whitePlayer}
            isActiveTurn={chess.turn() === (playerColor === "w" ? "b" : "w")}
          />
          <div className="bg-black border-2 border-[#F4E9CD] rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="text-[#F4E9CD]" size={20} />
              <span className="text-[#F4E9CD]/70 text-sm font-medium">
                MATCH TIME
              </span>
            </div>
            <div className="text-[#F4E9CD] text-4xl font-bold font-mono">
              {formatTime(matchTime)}
            </div>
          </div>
          <PlayerCard
            player={playerColor === "w" ? whitePlayer : blackPlayer}
            isActiveTurn={chess.turn() === playerColor}
          />
        </div>
        <div className="flex items-center justify-center lg:order-2 order-1">
          <Board
            board={boardLayout}
            pieces={boardPieces}
            chess={chess}
            onPieceDrop={onPieceDrop}
          />
        </div>
        <MoveHistory moves={moveHistory} />
      </div>
    </div>
  );
}

export default Match;

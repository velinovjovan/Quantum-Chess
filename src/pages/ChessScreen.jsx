import { Chess } from "chess.js";
import { useRef, useState } from "react";
import Board from "../components/Board";

const board = [
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
];

function ChessScreen() {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.board());

  const makeRandomMove = () => {
    const possibleMoves = chessGame.moves();

    if (chessGame.isGameOver()) {
      console.log(chessGame.isGameOver());
      return;
    }

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    chessGame.move(randomMove);

    setChessPosition(chessGame.board());
  };

  const onPieceDrop = (sourceSquare, targetSquare) => {
    if (!targetSquare) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to queen
      });

      setChessPosition(chessGame.board());

      // make random CPU move after delay
      setTimeout(makeRandomMove, 500);

      return true;
    } catch {
      return false;
    }
  };

  return (
    <Board
      board={board}
      pieces={chessPosition.flat()}
      chess={chessGame}
      onPieceDrop={onPieceDrop}
    />
  );
}

export default ChessScreen;

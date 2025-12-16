import { Chess } from "chess.js";
import { useRef, useState } from "react";
import Board from "../components/chess/Board";
import { boardSquares } from "../assets/boardSquares";

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
      board={boardSquares}
      pieces={chessPosition.flat()}
      chess={chessGame}
      onPieceDrop={onPieceDrop}
    />
  );
}

export default ChessScreen;

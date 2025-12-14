import { useState } from "react";
import Piece from "./Piece";
import Square from "./Square";

function Board({ board, pieces, chess, onPieceDrop }) {
  const [from, setFrom] = useState("");
  const [possible, setPossible] = useState([]);

  const possibleClean = possible.map(
    (move) => move.match(/[a-h][1-8]/g)?.pop() || ""
  );

  const handleOnClick = (square) => {
    if (from === "") {
      setFrom(square);
      setPossible(chess.moves({ square }));
    } else {
      onPieceDrop(from, square);
      setFrom("");
      setPossible([]);
    }
  };

  return (
    <div className="w-[50rem] mx-auto mt-16 grid grid-cols-8 grid-rows-8">
      {board.map((square, index) => (
        <Square
          square={square}
          key={square}
          color={chess.squareColor(square)}
          handleOnClick={handleOnClick}
          from={from === square}
          possible={possibleClean.includes(square)}
        >
          {pieces[index] ? <Piece piece={pieces[index]} /> : null}
        </Square>
      ))}
    </div>
  );
}

export default Board;

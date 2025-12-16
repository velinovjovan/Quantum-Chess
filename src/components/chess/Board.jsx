import { useState } from "react";
import Piece from "./Piece";
import Square from "./Square";

function Board({ board, pieces, chess, onPieceDrop }) {
  const [from, setFrom] = useState("");
  const [possible, setPossible] = useState([]);

  const possibleClean = possible.map(
    (move) => move.match(/[a-h][1-8]/g)?.pop() || ""
  );

  const handleOnClick = async (square) => {
    if (from === "") {
      setFrom(square);
      setPossible(chess.moves({ square }));
      return;
    }

    let success = false;

    try {
      success = await onPieceDrop(from, square);
    } catch (err) {
      success = false;
      console.log(err);
    }

    if (success) {
      setFrom("");
      setPossible([]);
      return;
    }

    setFrom("");
    setPossible([]);
  };

  return (
    <div className="w-full max-w-[540px] md:max-w-[650px] lg:max-w-[700px] aspect-square grid grid-cols-8 grid-rows-8 shadow-2xl">
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

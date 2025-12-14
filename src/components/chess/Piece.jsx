import { memo } from "react";

function Piece({ piece }) {
  return (
    <img
      src={`pieces/${piece.type}-${
        piece.color === "w" ? "white" : "black"
      }.svg`}
      alt={piece.type}
    />
  );
}

export default memo(Piece);

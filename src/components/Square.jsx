function Square({ color, handleOnClick, square, from, possible, children }) {
  return (
    <div
      onClick={() => handleOnClick(square)}
      className={`${
        from
          ? "bg-green-300"
          : possible
          ? "bg-green-100"
          : color === "light"
          ? "bg-[#f2e1c3]"
          : "bg-[#c3a082]"
      } text-white font-bold text-xl aspect-square flex justify-center align-center`}
    >
      {children}
    </div>
  );
}

export default Square;

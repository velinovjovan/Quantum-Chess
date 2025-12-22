function PlayHero({ isSearching }) {
  return (
    <div className="text-center space-y-3">
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#F4E9CD] tracking-tight mt-[-2rem] mb-5">
        Ready to Play?
      </h2>
      <p className="text-[#F4E9CD]/60 text-md sm:text-lg md:text-xl">
        {isSearching
          ? "Searching for worthy opponent..."
          : "Challenge players from around the world"}
      </p>
    </div>
  );
}

export default PlayHero;

function SearchButton({ isSearching, handleCancel, handleFindMatch }) {
  return (
    <button
      onClick={isSearching ? handleCancel : handleFindMatch}
      className={`
              group relative
              px-12 py-5
              text-lg font-bold
              rounded-2xl
              transition-all duration-300
              shadow-2xl
              ${
                isSearching
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105"
                  : "bg-[#F4E9CD] text-black hover:bg-[#F4E9CD]/90 hover:scale-105"
              }
            `}
    >
      <span className="relative z-10">
        {isSearching ? "Cancel Search" : "Find Match"}
      </span>
      {!isSearching && (
        <div className="absolute inset-0 rounded-2xl bg-[#F4E9CD] blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
      )}
    </button>
  );
}

export default SearchButton;

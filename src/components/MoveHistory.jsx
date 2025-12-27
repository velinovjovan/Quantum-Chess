import { memo } from "react";

const MoveHistory = memo(({ moves }) => {
  return (
    <div className="bg-black border-2 border-[#F4E9CD] rounded-lg p-4 flex flex-col h-full min-h-0">
      <h3 className="text-[#F4E9CD] font-bold text-lg mb-4 flex items-center gap-2">
        <span>MOVE HISTORY</span>
        <span className="text-sm text-[#F4E9CD]/70">({moves.length})</span>
      </h3>
      <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-2">
        {moves.length === 0 ? (
          <p className="text-[#F4E9CD]/50 text-sm text-center py-8">
            No moves yet
          </p>
        ) : (
          [...moves]
            .slice()
            .reverse()
            .map((move, index) => {
              const moveNumber = moves.length - index;
              return (
                <div
                  key={`${moveNumber}-${move.from}-${move.to}`}
                  className="bg-[#F4E9CD]/10 rounded px-3 py-2 flex items-center gap-3 hover:bg-[#F4E9CD]/20 transition-colors"
                >
                  <span className="text-[#F4E9CD]/70 text-xs font-mono w-10 text-right">
                    {moveNumber}.
                  </span>
                  <span className="text-[#F4E9CD] font-mono text-sm flex-1">
                    {move.from} → {move.to}
                  </span>
                  <span className="text-[#F4E9CD]/50 text-xs">
                    {move.color === "w" ? "White" : "Black"}
                  </span>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
});

export default MoveHistory;

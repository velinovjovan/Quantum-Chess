import { Trophy, Home } from "lucide-react";

const GameOverModal = ({ winner, playerColor, onNavigate }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black border-4 border-[#F4E9CD] rounded-2xl p-12 text-center max-w-md">
        <div className="mb-6">
          {winner ? (
            <>
              <Trophy className="mx-auto mb-4 text-yellow-400" size={64} />
              <h1 className="text-4xl font-bold text-[#F4E9CD] mb-2">
                {winner === playerColor ? "You Won!" : "You Lost"}
              </h1>
              <p className="text-[#F4E9CD]/70 text-lg mb-4">
                {winner === playerColor ? (
                  <>
                    <span className="text-green-400 font-bold">+30</span> rating
                  </>
                ) : (
                  <>
                    <span className="text-red-400 font-bold">-20</span> rating
                  </>
                )}
              </p>
            </>
          ) : (
            <>
              <Trophy className="mx-auto mb-4 text-gray-400" size={64} />
              <h1 className="text-4xl font-bold text-[#F4E9CD] mb-2">Draw</h1>
              <p className="text-[#F4E9CD]/70 text-lg">
                The game ended in a draw
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onNavigate}
            className="w-full bg-[#F4E9CD] text-black font-bold py-3 rounded-lg hover:bg-[#F4E9CD]/90 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;

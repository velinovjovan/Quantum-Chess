import { User } from "lucide-react";

function topRow({ setSidebarOpen }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="sm:w-24 sm:h-24 h-16 w-16 bg-black rounded-xl flex items-center justify-center overflow-hidden border-[#222] border-2">
          <img
            src="logos/logo.png"
            className="w-full h-full object-cover scale-150"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#F4E9CD] tracking-tight hidden md:block">
          Quantum Chess
        </h1>
      </div>

      <button
        onClick={() => setSidebarOpen(true)}
        className="p-3 bg-[#F4E9CD]/10 backdrop-blur-sm text-[#F4E9CD] rounded-xl border border-[#F4E9CD]/20 hover:bg-[#F4E9CD]/20 transition-all hover:scale-105"
      >
        <User className=" sm:h-20 sm:w-20 h-10 w-10" />
      </button>
    </div>
  );
}

export default topRow;

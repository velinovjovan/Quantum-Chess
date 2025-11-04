import { useState } from "react";
import Orb from "../components/backgrounds/Orb";
import { User, X } from "lucide-react";

function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFindMatch = () => {
    setIsSearching(true);
  };

  const handleCancel = () => {
    setIsSearching(false);
  };

  return (
    <div className="relative h-screen w-full bg-[#F4E9CD] overflow-hidden">
      <Orb
        hoverIntensity={1.3}
        rotateOnHover={true}
        hue={160}
        forceHoverState={isSearching}
      />

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-5xl font-bold text-amber-900 tracking-tight">
            Quantum Chess
          </h1>

          <button
            onClick={isSearching ? handleCancel : handleFindMatch}
            className={`
              px-12 py-4 
              text-lg font-semibold 
              rounded-full 
              transition-all duration-300 
              shadow-lg hover:shadow-2xl
              ${
                isSearching
                  ? "bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-800 hover:to-red-900"
                  : "bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 hover:from-amber-800 hover:to-amber-950 hover:scale-105"
              }
            `}
          >
            {isSearching ? "Cancel" : "Find a Match"}
          </button>
        </div>
      </div>

      {/* Account Icon */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-6 right-6 z-20 p-3 bg-amber-800 text-amber-50 rounded-full shadow-lg hover:bg-amber-900 transition-all hover:scale-110"
      >
        <User size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-amber-950 shadow-2xl z-30 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-amber-100">Account</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-amber-900 rounded-full transition-colors"
            >
              <X size={24} className="text-amber-100" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center">
                <User size={32} className="text-amber-100" />
              </div>
              <div>
                <p className="text-amber-100 font-semibold text-lg">Player</p>
                <p className="text-amber-300 text-sm">Quantum Master</p>
              </div>
            </div>

            <div className="border-t border-amber-800 pt-6 space-y-4">
              <div>
                <p className="text-amber-300 text-sm">Rating</p>
                <p className="text-amber-100 text-xl font-bold">1500</p>
              </div>
              <div>
                <p className="text-amber-300 text-sm">Games Played</p>
                <p className="text-amber-100 text-xl font-bold">42</p>
              </div>
              <div>
                <p className="text-amber-300 text-sm">Win Rate</p>
                <p className="text-amber-100 text-xl font-bold">67%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

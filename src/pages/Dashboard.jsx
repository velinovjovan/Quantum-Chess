import { useEffect, useState } from "react";
import Squares from "../components/backgrounds/Squares";
import { User, Clock, Users } from "lucide-react";
import { supabase } from "../assets/supabaseClient";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";

function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) navigate("/");
    }

    checkUser();
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    setSidebarOpen(false);
    navigate("/");
  };

  const handleFindMatch = () => {
    setIsSearching(true);
  };

  const handleCancel = () => {
    setIsSearching(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <Squares
        speed={isSearching ? 0.6 : 0.2}
        squareSize={40}
        direction="down"
        borderColor="#333"
        hoverFillColor="#111"
        className="absolute inset-0 h-full w-full z-0"
      />
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 bg-black rounded-xl flex items-center justify-center overflow-hidden border-[#222] border-2">
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
          <User size={72} />
        </button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-14 px-4">
          <div className="text-center space-y-3">
            <h2 className="text-5xl md:text-7xl font-bold text-[#F4E9CD] tracking-tight mt-[-2rem] mb-5">
              Ready to Play?
            </h2>
            <p className="text-[#F4E9CD]/60 text-lg md:text-xl">
              {isSearching
                ? "Searching for worthy opponent..."
                : "Challenge players from around the world"}
            </p>
          </div>
          {isSearching && (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#F4E9CD]/20 border-t-[#F4E9CD] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users size={32} className="text-[#F4E9CD]" />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#F4E9CD]/5 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F4E9CD]/20">
                <Clock size={18} className="text-[#F4E9CD]/60" />
                <span className="text-[#F4E9CD] font-mono text-lg">
                  {formatTime(searchTime)}
                </span>
              </div>
            </div>
          )}
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
          {!isSearching && (
            <div className="flex gap-6 mt-8">
              <div className="bg-[#F4E9CD]/5 backdrop-blur-sm px-6 py-4 rounded-xl border border-[#F4E9CD]/10">
                <p className="text-[#F4E9CD]/50 text-xs mb-1">Players Online</p>
                <p className="text-[#F4E9CD] text-2xl font-bold">1,234</p>
              </div>
              <div className="bg-[#F4E9CD]/5 backdrop-blur-sm px-6 py-4 rounded-xl border border-[#F4E9CD]/10">
                <p className="text-[#F4E9CD]/50 text-xs mb-1">Active Games</p>
                <p className="text-[#F4E9CD] text-2xl font-bold">567</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <div className="bg-[#F4E9CD]/5 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F4E9CD]/10">
          <p className="text-[#F4E9CD]/60 text-sm">
            Press <span className="text-[#F4E9CD] font-semibold">Space</span> to
            quick match
          </p>
        </div>
      </div>
      <ProfileCard
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleSignOut={handleSignOut}
      />
    </div>
  );
}

export default Dashboard;

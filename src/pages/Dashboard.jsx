import { useEffect, useRef, useState } from "react";
import Squares from "../components/backgrounds/Squares";
import { User, Clock, Users } from "lucide-react";
import { supabase } from "../assets/supabaseClient";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { formatTime } from "../assets/formatTime";

function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const hasNavigated = useRef(false);
  const searchInterval = useRef(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
      } else {
        setUserId(user.id);
      }
    }

    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (!isSearching) {
      setSearchTime(0);
      clearInterval(searchInterval.current);
      return;
    }

    searchInterval.current = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(searchInterval.current);
  }, [isSearching]);

  const handleFindMatch = async () => {
    if (!userId || isSearching) return;

    setIsSearching(true);
    hasNavigated.current = false;
    const startedAt = new Date().toISOString();

    const { data: matchId, error } = await supabase.rpc("find_match", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Matchmaking error:", error.message);
      setIsSearching(false);
      return;
    }

    if (matchId && !hasNavigated.current) {
      hasNavigated.current = true;
      setIsSearching(false);
      navigate(`/match/${matchId}`);
      return;
    }

    pollInterval.current = setInterval(async () => {
      if (hasNavigated.current) return;

      const { data } = await supabase
        .from("matches")
        .select("id")
        .or(`white_player.eq.${userId},black_player.eq.${userId}`)
        .gte("created_at", startedAt)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.id) {
        hasNavigated.current = true;
        setIsSearching(false);
        clearInterval(pollInterval.current);
        navigate(`/match/${data.id}`);
      }
    }, 2500);
  };

  const handleCancel = async () => {
    setIsSearching(false);
    hasNavigated.current = false;

    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }

    if (!userId) return;

    await supabase.from("matchmaking_queue").delete().eq("user_id", userId);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSidebarOpen(false);
    navigate("/");
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

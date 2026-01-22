import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { supabase } from "../assets/supabaseClient";
import { formatTime } from "../assets/formatTime";
import { matchWithBot } from "../assets/matchWithBot";
import Squares from "../components/backgrounds/Squares";
import ProfileCard from "../components/ProfileCard";
import TopRow from "../components/TopRow";
import PlayHero from "../components/PlayHero";
import SearchButton from "../components/SearchButton";
import SpaceToPlay from "../components/SpaceToPlay";

function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isSearching || searchTime < 15) return;
    else matchWithBot(setIsSearching, supabase, userId, navigate);
  }, [isSearching, searchTime, userId, navigate]);

  useEffect(() => {
    if (!isSearching || !userId) return;

    const channel = supabase
      .channel("matchmaking-listener")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `white_player=eq.${userId}`,
        },
        (payload) => {
          setIsSearching(false);
          navigate(`/match/${payload.new.id}`);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `black_player=eq.${userId}`,
        },
        (payload) => {
          setIsSearching(false);
          navigate(`/match/${payload.new.id}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSearching, userId, navigate]);

  const handleFindMatch = async () => {
    setIsSearching(true);

    const { data: matchId, error } = await supabase.rpc("find_match", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Matchmaking error:", error.message);
      setIsSearching(false);
      return;
    }

    if (matchId) {
      setIsSearching(false);
      navigate(`/match/${matchId}`);
    }
  };

  const handleCancel = async () => {
    setIsSearching(false);
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
      <TopRow setSidebarOpen={setSidebarOpen} />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-14 px-4">
          <PlayHero isSearching={isSearching} />
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
          <SearchButton
            isSearching={isSearching}
            handleCancel={handleCancel}
            handleFindMatch={handleFindMatch}
          />
        </div>
      </div>
      <SpaceToPlay />
      <ProfileCard
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleSignOut={handleSignOut}
      />
    </div>
  );
}

export default Dashboard;

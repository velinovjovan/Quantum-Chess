import { useEffect, useState } from "react";
import { X, User, Trophy, Target, TrendingUp } from "lucide-react";
import { supabase } from "../assets/supabaseClient";

function ProfileCard({ sidebarOpen, setSidebarOpen, handleSignOut }) {
  const [profile, setProfile] = useState({
    username: "",
    avatar_url: "",
    rating: 0,
    games: 0,
    wins: 0,
  });
  const [loading, setLoading] = useState(false);
  const winRate =
    profile.games > 0 ? Math.round((profile.wins / profile.games) * 100) : 0;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Failed to get auth user:", userError.message);
        setLoading(false);
        return;
      }
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("id, username, avatar_url, rating, games, wins")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Failed to fetch profile:", error.message);
      } else if (data) {
        setProfile({
          username: data.username || "Player",
          avatar_url: data.avatar_url || "",
          rating: data.rating ?? 0,
          games: data.games ?? 0,
          wins: data.wins ?? 0,
        });
      }
      setLoading(false);
    };

    if (sidebarOpen) fetchProfile();
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-black shadow-2xl z-30 transform transition-all duration-500 ease-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="relative p-8 border-b border-[#F4E9CD]/10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-[#F4E9CD]/5 rounded-full transition-all duration-300 group"
            >
              <X
                size={20}
                className="text-[#F4E9CD]/60 group-hover:text-[#F4E9CD] transition-colors"
              />
            </button>
            <h2 className="text-3xl font-bold text-[#F4E9CD] tracking-tight">
              Profile
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F4E9CD] to-[#F4E9CD]/70 rounded-2xl flex items-center justify-center shadow-lg">
                    <User size={36} className="text-black" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div>
                <p className="text-[#F4E9CD] font-bold text-xl">
                  {profile.username || (loading ? "Loading..." : "Player")}
                </p>
                <p className="text-[#F4E9CD]/50 text-sm mt-1">
                  {loading ? "Fetching stats..." : "Quantum Master"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F4E9CD]/5 rounded-2xl p-4 border border-[#F4E9CD]/10 hover:border-[#F4E9CD]/30 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <Trophy
                    size={20}
                    className="text-[#F4E9CD]/60 mb-2 group-hover:text-[#F4E9CD] transition-colors"
                  />
                  <p className="text-[#F4E9CD]/50 text-xs mb-1">Rating</p>
                  <p className="text-[#F4E9CD] text-2xl font-bold">
                    {profile.rating || 0}
                  </p>
                </div>
              </div>

              <div className="bg-[#F4E9CD]/5 rounded-2xl p-4 border border-[#F4E9CD]/10 hover:border-[#F4E9CD]/30 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <Target
                    size={20}
                    className="text-[#F4E9CD]/60 mb-2 group-hover:text-[#F4E9CD] transition-colors"
                  />
                  <p className="text-[#F4E9CD]/50 text-xs mb-1">Games</p>
                  <p className="text-[#F4E9CD] text-2xl font-bold">
                    {profile.games || 0}
                  </p>
                </div>
              </div>

              <div className="bg-[#F4E9CD]/5 rounded-2xl p-4 border border-[#F4E9CD]/10 hover:border-[#F4E9CD]/30 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp
                    size={20}
                    className="text-[#F4E9CD]/60 mb-2 group-hover:text-[#F4E9CD] transition-colors"
                  />
                  <p className="text-[#F4E9CD]/50 text-xs mb-1">Win Rate</p>
                  <p className="text-[#F4E9CD] text-2xl font-bold">
                    {winRate}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#F4E9CD]/5 rounded-2xl p-6 border border-[#F4E9CD]/10">
              <h3 className="text-[#F4E9CD] font-semibold mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4E9CD]/10 rounded-lg flex items-center justify-center">
                    <Trophy size={18} className="text-[#F4E9CD]" />
                  </div>
                  <div>
                    <p className="text-[#F4E9CD] text-sm font-medium">
                      First Victory
                    </p>
                    <p className="text-[#F4E9CD]/40 text-xs">
                      Won your first game
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4E9CD]/10 rounded-lg flex items-center justify-center">
                    <Target size={18} className="text-[#F4E9CD]" />
                  </div>
                  <div>
                    <p className="text-[#F4E9CD] text-sm font-medium">
                      Quick Thinker
                    </p>
                    <p className="text-[#F4E9CD]/40 text-xs">
                      Won in under 20 moves
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 border-t border-[#F4E9CD]/10">
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-4 rounded-2xl bg-[#F4E9CD] text-black font-semibold shadow-lg hover:shadow-xl hover:bg-[#F4E9CD]/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;

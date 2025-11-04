import React, { useEffect, useState } from "react";
import {
  User,
  Trophy,
  Target,
  Clock,
  Settings,
  LogOut,
  Play,
  Search,
  History,
  BookOpen,
  Users,
  Swords,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../assets/supabaseClient";

export default function ChessDashboard() {
  const [activeSection, setActiveSection] = useState("play");
  const [searchingGame, setSearchingGame] = useState(false);
  const [timeControl, setTimeControl] = useState("10min");
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

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("User signed out successfully");
      navigate("/");
    }
  };

  const userData = {
    username: "ChessMaster2024",
    rating: 1842,
    country: "United States",
    avatar: "CM",
  };

  const stats = {
    totalGames: 247,
    wins: 142,
    losses: 78,
    draws: 27,
    winRate: 57.5,
    streak: 5,
  };

  const onlineUsers = [
    { name: "KnightRider99", rating: 1850, status: "online" },
    { name: "PawnStorm", rating: 1920, status: "playing" },
    { name: "RookMaster", rating: 1800, status: "online" },
    { name: "BishopBlitz", rating: 1845, status: "online" },
  ];

  const recentGames = [
    { opponent: "KnightRider99", result: "Win", rating: 1850, time: "2h ago" },
    { opponent: "PawnStorm", result: "Loss", rating: 1920, time: "5h ago" },
    { opponent: "RookMaster", result: "Win", rating: 1800, time: "1d ago" },
  ];

  const puzzles = [
    { difficulty: "Easy", rating: 1500, solved: 45, total: 50 },
    { difficulty: "Medium", rating: 1800, solved: 32, total: 50 },
    { difficulty: "Hard", rating: 2100, solved: 18, total: 50 },
  ];

  const handleFindGame = () => {
    setSearchingGame(true);
    setTimeout(() => {
      setSearchingGame(false);
      alert("Game found! Starting match...");
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-amber-900 to-amber-950 backdrop-blur-sm border-r border-amber-800 flex flex-col shadow-2xl">
        {/* User Profile */}
        <div className="p-6 border-b border-amber-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center text-2xl font-bold text-amber-50 shadow-lg">
              {userData.avatar}
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-50">
                {userData.username}
              </h2>
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={16} />
                <span className="text-amber-300 font-semibold">
                  {userData.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-amber-800/50 rounded-lg p-2 border border-amber-700">
              <p className="text-green-400 font-bold text-lg">{stats.wins}</p>
              <p className="text-xs text-amber-300">Wins</p>
            </div>
            <div className="bg-amber-800/50 rounded-lg p-2 border border-amber-700">
              <p className="text-red-400 font-bold text-lg">{stats.losses}</p>
              <p className="text-xs text-amber-300">Losses</p>
            </div>
            <div className="bg-amber-800/50 rounded-lg p-2 border border-amber-700">
              <p className="text-yellow-400 font-bold text-lg">{stats.draws}</p>
              <p className="text-xs text-amber-300">Draws</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveSection("play")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === "play"
                ? "bg-amber-700 text-amber-50 shadow-lg"
                : "text-amber-200 hover:bg-amber-800"
            }`}
          >
            <Play size={20} />
            <span className="font-medium">Play</span>
          </button>

          <button
            onClick={() => setActiveSection("puzzles")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === "puzzles"
                ? "bg-amber-700 text-amber-50 shadow-lg"
                : "text-amber-200 hover:bg-amber-800"
            }`}
          >
            <Target size={20} />
            <span className="font-medium">Puzzles</span>
          </button>

          <button
            onClick={() => setActiveSection("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === "history"
                ? "bg-amber-700 text-amber-50 shadow-lg"
                : "text-amber-200 hover:bg-amber-800"
            }`}
          >
            <History size={20} />
            <span className="font-medium">Game History</span>
          </button>

          <button
            onClick={() => setActiveSection("learn")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === "learn"
                ? "bg-amber-700 text-amber-50 shadow-lg"
                : "text-amber-200 hover:bg-amber-800"
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Learn</span>
          </button>

          <button
            onClick={() => setActiveSection("social")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === "social"
                ? "bg-amber-700 text-amber-50 shadow-lg"
                : "text-amber-200 hover:bg-amber-800"
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Friends</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-amber-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-amber-200 hover:bg-amber-800 rounded-lg transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-amber-800 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Play Section */}
          {activeSection === "play" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-amber-900 mb-8">
                Find a Game
              </h1>

              {/* Game Modes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform shadow-xl">
                  <Swords className="text-amber-50" size={40} />
                  <h3 className="text-2xl font-bold text-amber-50 mb-2 mt-4">
                    Quick Match
                  </h3>
                  <p className="text-green-100">Jump into a game instantly</p>
                </div>

                <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform shadow-xl">
                  <Clock className="text-amber-50" size={40} />
                  <h3 className="text-2xl font-bold text-amber-50 mb-2 mt-4">
                    Timed Match
                  </h3>
                  <p className="text-amber-100">Choose your time control</p>
                </div>

                <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform shadow-xl">
                  <Users className="text-amber-50" size={40} />
                  <h3 className="text-2xl font-bold text-amber-50 mb-2 mt-4">
                    Play Friend
                  </h3>
                  <p className="text-orange-100">Challenge a friend</p>
                </div>
              </div>

              {/* Matchmaking */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200 shadow-xl">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">
                  Quick Match Settings
                </h2>

                <div className="mb-6">
                  <label className="block text-amber-800 mb-3 font-medium">
                    Time Control
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["1min", "3min", "5min", "10min", "15min", "30min"].map(
                      (time) => (
                        <button
                          key={time}
                          onClick={() => setTimeControl(time)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            timeControl === time
                              ? "bg-amber-700 text-amber-50 shadow-lg"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={handleFindGame}
                  disabled={searchingGame}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    searchingGame
                      ? "bg-yellow-600 text-white cursor-wait"
                      : "bg-gradient-to-r from-green-700 to-green-800 text-amber-50 hover:from-green-600 hover:to-green-700"
                  }`}
                >
                  {searchingGame ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Searching for opponent...
                    </div>
                  ) : (
                    "Find Game"
                  )}
                </button>
              </div>

              {/* Online Players */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-xl">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">
                  Players Online
                </h2>
                <div className="space-y-3">
                  {onlineUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-amber-50 rounded-lg p-4 border border-amber-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center font-bold text-amber-50">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-amber-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-amber-700">
                            Rating: {user.rating}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg transition-colors shadow">
                        Challenge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Puzzles Section */}
          {activeSection === "puzzles" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-amber-900 mb-8">
                Chess Puzzles
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {puzzles.map((puzzle, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">
                      {puzzle.difficulty}
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Rating: {puzzle.rating}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-amber-800">Progress</span>
                        <span className="text-amber-800">
                          {puzzle.solved}/{puzzle.total}
                        </span>
                      </div>
                      <div className="w-full bg-amber-100 rounded-full h-3 border border-amber-200">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${(puzzle.solved / puzzle.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <button className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg font-semibold transition-colors shadow">
                      Start Puzzle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game History Section */}
          {activeSection === "history" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-amber-900 mb-8">
                Game History
              </h1>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-xl">
                <div className="space-y-3">
                  {recentGames.map((game, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 rounded-lg p-4 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-amber-50 shadow ${
                              game.result === "Win"
                                ? "bg-green-700"
                                : "bg-red-700"
                            }`}
                          >
                            {game.result}
                          </div>
                          <div>
                            <p className="font-semibold text-amber-900 text-lg">
                              vs {game.opponent}
                            </p>
                            <p className="text-amber-700 text-sm">
                              {game.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-900">
                            Rating: {game.rating}
                          </p>
                          <button className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                            View Game
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learn Section */}
          {activeSection === "learn" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-amber-900 mb-8">
                Learn Chess
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer shadow-xl">
                  <BookOpen className="text-amber-700" size={40} />
                  <h3 className="text-2xl font-bold text-amber-900 mb-2 mt-4">
                    Opening Theory
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Master popular chess openings
                  </p>
                  <button className="text-amber-700 hover:text-amber-800 font-semibold">
                    Start Learning →
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 hover:border-green-400 transition-colors cursor-pointer shadow-xl">
                  <Target className="text-green-700" size={40} />
                  <h3 className="text-2xl font-bold text-amber-900 mb-2 mt-4">
                    Tactics Training
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Improve your tactical vision
                  </p>
                  <button className="text-green-700 hover:text-green-800 font-semibold">
                    Start Training
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 hover:border-orange-400 transition-colors cursor-pointer shadow-xl">
                  <Trophy className="text-orange-700" size={40} />
                  <h3 className="text-2xl font-bold text-amber-900 mb-2 mt-4">
                    Endgame Mastery
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Perfect your endgame technique
                  </p>
                  <button className="text-orange-700 hover:text-orange-800 font-semibold">
                    Start Learning →
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 hover:border-yellow-400 transition-colors cursor-pointer shadow-xl">
                  <Search className="text-yellow-700" size={40} />
                  <h3 className="text-2xl font-bold text-amber-900 mb-2 mt-4">
                    Strategy Lessons
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Develop strategic thinking
                  </p>
                  <button className="text-yellow-700 hover:text-yellow-800 font-semibold">
                    Start Learning →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Section */}
          {activeSection === "social" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-amber-900 mb-8">
                Friends & Community
              </h1>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-xl">
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search for players..."
                    className="flex-1 bg-amber-50 text-amber-900 rounded-lg px-4 py-3 border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg font-semibold transition-colors shadow">
                    Search
                  </button>
                </div>

                <h3 className="text-xl font-bold text-amber-900 mb-4">
                  Your Friends
                </h3>
                <p className="text-amber-700 text-center py-8">
                  No friends added yet. Search for players to add them!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

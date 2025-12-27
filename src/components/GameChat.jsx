import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "../assets/supabaseClient";
import "../CSS/GameChat.css";

function GameChat({ matchId, userId, isBotMatch }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!matchId && !isBotMatch) return;

    const fetchInitialData = async () => {
      // Get current user's username
      const { data: userData } = await supabase
        .from("users")
        .select("username")
        .eq("id", userId)
        .single();

      if (userData) {
        setSenderUsername(userData.username);
      }

      // Fetch existing messages
      if (matchId) {
        const { data: chatMessages, error } = await supabase
          .from("match_chat")
          .select("id, message, user_id, username, created_at")
          .eq("match_id", matchId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Failed to load chat messages:", error);
          return;
        }

        setMessages(chatMessages || []);
      }
    };

    fetchInitialData();
  }, [matchId, userId, isBotMatch]);

  // Subscribe to real-time chat updates
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`match_chat_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_chat",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [matchId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !matchId || !userId) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("match_chat").insert({
        match_id: matchId,
        user_id: userId,
        username: senderUsername,
        message: newMessage.trim(),
      });

      if (error) {
        console.error("Failed to send message:", error);
      } else {
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isBotMatch) {
    return (
      <div className="game-chat">
        <div className="chat-messages">
          <div className="bot-message">
            <p className="text-sm text-gray-600">
              Chat unavailable in bot matches
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-chat">
      <div className="chat-header">
        <h3 className="text-sm font-bold text-[#F4E9CD]">GAME CHAT</h3>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p className="text-xs text-[#F4E9CD]/50">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.user_id === userId ? "own-message" : "other-message"
              }`}
            >
              <span className="text-xs font-semibold text-[#F4E9CD]">
                {msg.username}
              </span>
              <p className="text-sm text-[#F4E9CD]/90">{msg.message}</p>
              <span className="text-xs text-[#F4E9CD]/50">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={loading}
          maxLength={500}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !newMessage.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default GameChat;

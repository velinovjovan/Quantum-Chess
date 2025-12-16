import { memo, useState } from "react";
import { User } from "lucide-react";

const PlayerCard = memo(({ player, isActiveTurn }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-black border-2 border-[#F4E9CD] rounded-lg p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#F4E9CD] flex items-center justify-center flex-shrink-0">
        {player?.avatar_url && !imageError ? (
          <img
            src={player.avatar_url}
            alt={player.username}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className="text-black" size={24} />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-[#F4E9CD] font-bold text-lg">
          {player?.username || "Loading..."}
        </h3>
        <p className="text-[#F4E9CD]/70 text-sm">
          Rating: {player?.rating || "—"}
        </p>
      </div>
      {isActiveTurn && (
        <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
      )}
    </div>
  );
});

PlayerCard.displayName = "PlayerCard";

export default PlayerCard;

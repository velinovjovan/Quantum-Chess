import { Trophy } from "lucide-react";

function Achievement() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#F4E9CD]/10 rounded-lg flex items-center justify-center">
        <Trophy size={18} className="text-[#F4E9CD]" />
      </div>
      <div>
        <p className="text-[#F4E9CD] text-sm font-medium">First Victory</p>
        <p className="text-[#F4E9CD]/40 text-xs">Won your first game</p>
      </div>
    </div>
  );
}

export default Achievement;

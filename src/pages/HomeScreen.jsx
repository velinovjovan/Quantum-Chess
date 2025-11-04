import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../assets/supabaseClient";
import Squares from "../components/backgrounds/Squares";
import LandingContent from "../components/LandingContent";

function HomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) navigate("/account");
    }

    checkUser();
  }, [navigate]);

  return (
    <div className="relative h-screen w-screen bg-[#F4E9CD] overflow-hidden">
      <Squares
        speed={0.4}
        squareSize={40}
        direction="down"
        borderColor="#fff"
        hoverFillColor="#874000"
        className="absolute inset-0 h-full w-full z-0"
      />
      <LandingContent />
    </div>
  );
}

export default HomeScreen;

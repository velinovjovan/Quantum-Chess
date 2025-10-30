import Squares from "../components/Squares";
import LandingContent from "../components/LandingContent";

function HomeScreen() {
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

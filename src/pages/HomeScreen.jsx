import CardNav from "../components/CardNav";
import ScrambledText from "../components/ScrambledText";
import SignInButtons from "../components/SignInButtons";
import Squares from "../components/Squares";

const items = [
  {
    label: "About",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      {
        label: "Company",
        ariaLabel: "About Company",
        href: "https://google.com",
      },
      { label: "Careers", ariaLabel: "About Careers" },
    ],
  },
  {
    label: "Projects",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Featured", ariaLabel: "Featured Projects" },
      { label: "Case Studies", ariaLabel: "Project Case Studies" },
    ],
  },
  {
    label: "Contact",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Email", ariaLabel: "Email us" },
      { label: "Twitter", ariaLabel: "Twitter" },
      { label: "LinkedIn", ariaLabel: "LinkedIn" },
    ],
  },
];

function HomeScreen() {
  return (
    <div className="relative h-screen w-screen bg-[#060010] overflow-hidden">
      <Squares
        speed={0.3}
        squareSize={40}
        direction="down"
        borderColor="#271E37"
        hoverFillColor="#222222"
        className="absolute inset-0 h-full w-full z-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-10 text-center w-fit mx-auto">
        <CardNav
          // logo={logo}
          logoAlt="Company Logo"
          items={items}
          baseColor="#fff"
          menuColor="#000"
          buttonBgColor="#111"
          buttonTextColor="#fff"
          ease="power3.out"
        />
        <ScrambledText
          radius={100}
          duration={1.2}
          speed={0.5}
          scrambleChars=".:"
          className=""
        >
          Dive into the world of quantum chess. Play online, master quantum
          principles, and experience how every move can shape countless possible
          outcomes.
        </ScrambledText>
        <SignInButtons />
      </div>
    </div>
  );
}

export default HomeScreen;

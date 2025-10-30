import items from "../assets/navItems";
import CardNav from "./CardNav";
import SignInButtons from "./SignInButtons";

function LandingContent() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10 p-10 text-center w-fit mx-auto">
      <CardNav
        logo={"/logos/logo_cropped.png"}
        logoAlt="Company Logo"
        items={items}
        baseColor="#000"
        menuColor="#fff"
        buttonBgColor="#F7F4EA"
        buttonTextColor="black"
        ease="power3.out"
        className="pointer-events-auto"
      />
      <p className="m-[7vw] max-w-[900px] font-mono text-[clamp(14px,4vw,32px)] whitespace-normal break-keep overflow-wrap-normal">
        Dive into the world of quantum chess. Play online, master quantum
        principles, and experience how every move can shape countless possible
        outcomes.
      </p>
      <SignInButtons />
    </div>
  );
}

export default LandingContent;

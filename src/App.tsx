import ThreeCanvas from "./components/ThreeCanvas";
import LobbyOverlay from "./components/LobbyOverlay";
import GameHUD from "./components/GameHUD";
import GameOverCard from "./components/GameOverCard";
import TouchControls from "./components/TouchControls";

export default function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ThreeCanvas />
      <LobbyOverlay />
      <GameHUD />
      <GameOverCard />
      <TouchControls />
    </div>
  );
}

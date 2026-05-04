import ThreeCanvas from "./components/ThreeCanvas";
import LobbyOverlay from "./components/LobbyOverlay";
import GameHUD from "./components/GameHUD";
import GameOverCard from "./components/GameOverCard";

export default function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <ThreeCanvas />
      <LobbyOverlay />
      <GameHUD />
      <GameOverCard />
    </div>
  );
}

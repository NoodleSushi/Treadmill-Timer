import { useEffect } from "react";
import { Timer } from "lucide-react";
import { useTimerStore } from "./store/timerStore";
import { TimerQueue } from "./components/TimerQueue";
import { ActiveTimer } from "./components/ActiveTimer";
import { PresetManager } from "./components/PresetManager";

export default function App() {
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const activeIndex = useTimerStore((s) => s.activeIndex);
  const items = useTimerStore((s) => s.items);
  const status = useTimerStore((s) => s.status);
  const isRunning = status === "running" || status === "paused";
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
        {/* Header */}
        <header className="flex items-center gap-2">
          <Timer className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold">Treadmill Timer</h1>
        </header>

        {/* Active timer display */}
        {activeItem && activeIndex !== null && isRunning && <ActiveTimer />}

        {/* Timer queue */}
        <TimerQueue />

        {/* Presets */}
        <PresetManager />
      </div>
    </div>
  );
}

import { Play, Pause, Square } from "lucide-react";
import { formatTime } from "../types";
import { useTimerStore } from "../store/timerStore";

export function ActiveTimer() {
  const item = useTimerStore((s) =>
    s.activeIndex !== null ? s.items[s.activeIndex] : null
  );
  const remaining = useTimerStore((s) => s.remaining);
  const status = useTimerStore((s) => s.status);
  const activeIndex = useTimerStore((s) => s.activeIndex);
  const queueTotal = useTimerStore((s) => s.items.length);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const stop = useTimerStore((s) => s.stop);

  if (!item || activeIndex === null) return null;

  const total = item.minutes * 60 + item.seconds;
  const progress = total > 0 ? 1 - remaining / total : 0;

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-700 bg-neutral-900 p-6">
      <span className="text-xs text-neutral-500">
        Timer {activeIndex + 1} of {queueTotal}
      </span>

      {/* Big countdown */}
      <span className="font-mono text-5xl font-bold text-white">
        {formatTime(remaining)}
      </span>

      {/* Speed */}
      <span className="text-lg text-blue-400">{item.speed} km/h</span>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-1000"
          style={{ width: `${(progress * 100).toFixed(1)}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {status === "running" ? (
          <button
            onClick={pause}
            className="rounded-full bg-neutral-800 p-3 text-white hover:bg-neutral-700"
            aria-label="Pause"
          >
            <Pause size={24} />
          </button>
        ) : (
          <button
            onClick={resume}
            className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-500"
            aria-label="Resume"
          >
            <Play size={24} />
          </button>
        )}
        <button
          onClick={stop}
          className="rounded-full bg-neutral-800 p-3 text-white hover:bg-neutral-700"
          aria-label="Stop"
        >
          <Square size={24} />
        </button>
      </div>
    </div>
  );
}

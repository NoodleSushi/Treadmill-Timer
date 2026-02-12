import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Play,
} from "lucide-react";
import type { TimerItem } from "../types";
import { formatTime, totalSeconds } from "../types";
import { useTimerStore } from "../store/timerStore";

interface TimerItemRowProps {
  item: TimerItem;
  index: number;
  total: number;
  isActive: boolean;
  isRunning: boolean;
}

export function TimerItemRow({
  item,
  index,
  total,
  isActive,
  isRunning,
}: TimerItemRowProps) {
  const updateItem = useTimerStore((s) => s.updateItem);
  const removeItem = useTimerStore((s) => s.removeItem);
  const moveItem = useTimerStore((s) => s.moveItem);
  const start = useTimerStore((s) => s.start);
  const disabled = isRunning;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
        isActive
          ? "border-blue-500 bg-blue-950/40"
          : "border-neutral-700 bg-neutral-900"
      }`}
    >
      {/* Reorder buttons */}
      <div className="flex flex-col -space-y-1">
        <button
          className="text-neutral-400 hover:text-white disabled:opacity-30"
          disabled={index === 0 || disabled}
          onClick={() => moveItem(index, -1)}
          aria-label="Move up"
        >
          <ChevronUp size={16} />
        </button>
        <button
          className="text-neutral-400 hover:text-white disabled:opacity-30"
          disabled={index === total - 1 || disabled}
          onClick={() => moveItem(index, 1)}
          aria-label="Move down"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Duration inputs */}
      <div className="flex items-center gap-1 text-sm">
        <input
          type="number"
          min={0}
          max={99}
          value={item.minutes}
          disabled={disabled}
          onChange={(e) =>
            updateItem(item.id, {
              minutes: Math.max(0, Math.min(99, Number(e.target.value) || 0)),
            })
          }
          className="w-12 rounded bg-neutral-800 px-1.5 py-1 text-center text-white disabled:opacity-50"
          aria-label="Minutes"
        />
        <span className="text-neutral-400">m</span>
        <input
          type="number"
          min={0}
          max={59}
          value={item.seconds}
          disabled={disabled}
          onChange={(e) =>
            updateItem(item.id, {
              seconds: Math.max(0, Math.min(59, Number(e.target.value) || 0)),
            })
          }
          className="w-12 rounded bg-neutral-800 px-1.5 py-1 text-center text-white disabled:opacity-50"
          aria-label="Seconds"
        />
        <span className="text-neutral-400">s</span>
      </div>

      {/* Speed input */}
      <div className="flex items-center gap-1 text-sm">
        <input
          type="number"
          min={0}
          step={0.5}
          value={item.speed}
          disabled={disabled}
          onChange={(e) =>
            updateItem(item.id, {
              speed: Math.max(0, Number(e.target.value) || 0),
            })
          }
          className="w-16 rounded bg-neutral-800 px-1.5 py-1 text-center text-white disabled:opacity-50"
          aria-label="Speed (km/h)"
        />
        <span className="text-neutral-400">km/h</span>
      </div>

      {/* Total display */}
      <span className="ml-auto text-xs text-neutral-500">
        {formatTime(totalSeconds(item))}
      </span>

      {/* Play from here */}
      <button
        className="text-neutral-400 hover:text-green-400 disabled:opacity-30"
        disabled={disabled || totalSeconds(item) === 0}
        onClick={() => start(index)}
        aria-label="Start from here"
      >
        <Play size={16} />
      </button>

      {/* Delete */}
      <button
        className="text-neutral-400 hover:text-red-400 disabled:opacity-30"
        disabled={disabled}
        onClick={() => removeItem(item.id)}
        aria-label="Remove"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

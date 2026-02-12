import { Plus } from "lucide-react";
import { useTimerStore } from "../store/timerStore";
import { TimerItemRow } from "./TimerItemRow";

export function TimerQueue() {
  const items = useTimerStore((s) => s.items);
  const activeIndex = useTimerStore((s) => s.activeIndex);
  const status = useTimerStore((s) => s.status);
  const addItem = useTimerStore((s) => s.addItem);
  const isRunning = status === "running" || status === "paused";

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
        Queue
      </h2>

      {items.length === 0 && (
        <p className="py-4 text-center text-sm text-neutral-500">
          No timers yet. Add one below.
        </p>
      )}

      {items.map((item, i) => (
        <TimerItemRow
          key={item.id}
          item={item}
          index={i}
          total={items.length}
          isActive={activeIndex === i}
          isRunning={isRunning}
        />
      ))}

      <button
        onClick={addItem}
        disabled={isRunning}
        className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-600 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-400 hover:text-white disabled:opacity-30"
      >
        <Plus size={16} />
        Add Timer
      </button>
    </div>
  );
}

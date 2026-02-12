import { create } from "zustand";
import type { TimerItem } from "../types";
import { totalSeconds } from "../types";

// ── Types ────────────────────────────────────────────────────────────────────

export type CountdownStatus = "idle" | "running" | "paused" | "finished";

interface TimerState {
  // Queue
  items: TimerItem[];
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<Omit<TimerItem, "id">>) => void;
  moveItem: (fromIndex: number, direction: -1 | 1) => void;
  loadItems: (items: Omit<TimerItem, "id">[]) => void;

  // Playback
  activeIndex: number | null;
  remaining: number;
  status: CountdownStatus;

  start: (index: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;

  // Internal — called by the interval tick
  _tick: () => void;
  _intervalId: ReturnType<typeof setInterval> | null;
  _clearInterval: () => void;
  _startInterval: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 1;
function createItem(): TimerItem {
  return { id: String(nextId++), minutes: 1, seconds: 0, speed: 5 };
}

function showDesktopNotification(
  completed: TimerItem,
  next: TimerItem | null
) {
  // Play alarm sound
  const audio = new Audio("/alarm.wav");
  audio.play().catch(() => {});

  if (!("Notification" in window) || Notification.permission !== "granted")
    return;

  const title = `Timer Complete! (${completed.minutes}m ${completed.seconds}s @ ${completed.speed} km/h)`;
  const body = next
    ? `Next: ${next.minutes}m ${next.seconds}s @ ${next.speed} km/h`
    : "All timers complete!";

  new Notification(title, { body, icon: "/vite.svg" });
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useTimerStore = create<TimerState>()((set, get) => ({
  // -- Queue state --
  items: [createItem()],

  addItem: () => set((s) => ({ items: [...s.items, createItem()] })),

  loadItems: (templateItems) =>
    set({
      items: templateItems.map(({ minutes, seconds, speed }) => ({
        id: String(nextId++),
        minutes,
        seconds,
        speed,
      })),
    }),

  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((item) => item.id !== id) })),

  updateItem: (id, patch) =>
    set((s) => ({
      items: s.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    })),

  moveItem: (fromIndex, direction) =>
    set((s) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= s.items.length) return s;
      const next = [...s.items];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return { items: next };
    }),

  // -- Playback state --
  activeIndex: null,
  remaining: 0,
  status: "idle",
  _intervalId: null,

  _clearInterval: () => {
    const id = get()._intervalId;
    if (id !== null) {
      clearInterval(id);
      set({ _intervalId: null });
    }
  },

  _startInterval: () => {
    get()._clearInterval();
    const id = setInterval(() => get()._tick(), 1000);
    set({ _intervalId: id });
  },

  _tick: () => {
    const { remaining, activeIndex, items } = get();
    if (remaining <= 1) {
      // Timer finished
      get()._clearInterval();

      const completedItem = activeIndex !== null ? items[activeIndex] : null;
      const nextIdx = activeIndex !== null ? activeIndex + 1 : null;
      const nextItem =
        nextIdx !== null && nextIdx < items.length ? items[nextIdx] : null;

      // Notify
      if (completedItem) {
        showDesktopNotification(completedItem, nextItem);
      }

      // Advance or stop
      if (nextItem && nextIdx !== null) {
        const secs = totalSeconds(nextItem);
        if (secs > 0) {
          set({
            activeIndex: nextIdx,
            remaining: secs,
            status: "running",
          });
          get()._startInterval();
          return;
        }
      }

      // No next — done
      set({ remaining: 0, status: "idle", activeIndex: null });
    } else {
      set({ remaining: remaining - 1 });
    }
  },

  start: (index) => {
    const item = get().items[index];
    if (!item) return;
    const secs = totalSeconds(item);
    if (secs === 0) return;
    get()._clearInterval();
    set({ activeIndex: index, remaining: secs, status: "running" });
    get()._startInterval();
  },

  pause: () => {
    if (get().status !== "running") return;
    get()._clearInterval();
    set({ status: "paused" });
  },

  resume: () => {
    if (get().status !== "paused") return;
    set({ status: "running" });
    get()._startInterval();
  },

  stop: () => {
    get()._clearInterval();
    set({ remaining: 0, status: "idle", activeIndex: null });
  },
}));

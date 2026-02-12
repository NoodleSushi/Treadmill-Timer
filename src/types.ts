export interface TimerItem {
  id: string;
  minutes: number;
  seconds: number;
  speed: number;
}

export interface Preset {
  id: string;
  name: string;
  items: Omit<TimerItem, "id">[];
}

export function totalSeconds(item: TimerItem): number {
  return item.minutes * 60 + item.seconds;
}

export function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

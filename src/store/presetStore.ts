import { create } from "zustand";
import type { Preset } from "../types";

const STORAGE_KEY = "workout-timer-presets";

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Preset[]) : [];
  } catch {
    return [];
  }
}

function persistPresets(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

let presetNextId = Date.now();

interface PresetState {
  presets: Preset[];
  savePreset: (name: string, items: { minutes: number; seconds: number; speed: number }[]) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
}

export const usePresetStore = create<PresetState>()((set) => ({
  presets: loadPresets(),

  savePreset: (name, items) =>
    set((s) => {
      const preset: Preset = {
        id: String(presetNextId++),
        name,
        items: items.map(({ minutes, seconds, speed }) => ({ minutes, seconds, speed })),
      };
      const next = [...s.presets, preset];
      persistPresets(next);
      return { presets: next };
    }),

  deletePreset: (id) =>
    set((s) => {
      const next = s.presets.filter((p) => p.id !== id);
      persistPresets(next);
      return { presets: next };
    }),

  renamePreset: (id, name) =>
    set((s) => {
      const next = s.presets.map((p) => (p.id === id ? { ...p, name } : p));
      persistPresets(next);
      return { presets: next };
    }),
}));

import { useState } from "react";
import { Save, Trash2, Upload, Pencil, Check, X } from "lucide-react";
import { usePresetStore } from "../store/presetStore";
import { useTimerStore } from "../store/timerStore";

export function PresetManager() {
  const presets = usePresetStore((s) => s.presets);
  const savePreset = usePresetStore((s) => s.savePreset);
  const deletePreset = usePresetStore((s) => s.deletePreset);
  const renamePreset = usePresetStore((s) => s.renamePreset);

  const items = useTimerStore((s) => s.items);
  const loadItems = useTimerStore((s) => s.loadItems);
  const status = useTimerStore((s) => s.status);
  const isRunning = status === "running" || status === "paused";

  const [saveName, setSaveName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleSave = () => {
    const name = saveName.trim();
    if (!name || items.length === 0) return;
    savePreset(name, items);
    setSaveName("");
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleConfirmRename = () => {
    if (editingId && editName.trim()) {
      renamePreset(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
        Presets
      </h2>

      {/* Save current queue */}
      <div className="flex gap-2">
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Preset name…"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={!saveName.trim() || items.length === 0}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-30"
        >
          <Save size={14} />
          Save
        </button>
      </div>

      {/* Preset list */}
      {presets.length === 0 && (
        <p className="py-2 text-center text-sm text-neutral-600">
          No saved presets.
        </p>
      )}

      {presets.map((preset) => (
        <div
          key={preset.id}
          className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2"
        >
          {editingId === preset.id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmRename();
                  if (e.key === "Escape") handleCancelRename();
                }}
                autoFocus
                className="flex-1 rounded bg-neutral-800 px-2 py-0.5 text-sm text-white focus:outline-none"
              />
              <button
                onClick={handleConfirmRename}
                className="text-green-400 hover:text-green-300"
                aria-label="Confirm rename"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancelRename}
                className="text-neutral-400 hover:text-white"
                aria-label="Cancel rename"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 truncate text-sm text-white">
                {preset.name}
              </span>
              <span className="text-xs text-neutral-500">
                {preset.items.length} item{preset.items.length !== 1 && "s"}
              </span>
              <button
                onClick={() => {
                  if (!isRunning) loadItems(preset.items);
                }}
                disabled={isRunning}
                className="text-neutral-400 hover:text-blue-400 disabled:opacity-30"
                aria-label="Load preset"
              >
                <Upload size={14} />
              </button>
              <button
                onClick={() => handleStartRename(preset.id, preset.name)}
                className="text-neutral-400 hover:text-yellow-400"
                aria-label="Rename preset"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                className="text-neutral-400 hover:text-red-400"
                aria-label="Delete preset"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

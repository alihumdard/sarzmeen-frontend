"use client";

import { adminInputClass, adminTextareaClass } from "@/components/admin/AdminFormField";

export type FloorDraft = {
  floorNumber: string;
  name: string;
};

export type TowerDraft = {
  name: string;
  floorsCount: string;
  unitsCount: string;
  description: string;
  floors: FloorDraft[];
};

export const emptyTower: TowerDraft = {
  name: "",
  floorsCount: "",
  unitsCount: "",
  description: "",
  floors: [],
};

type Props = {
  towers: TowerDraft[];
  onChange: (towers: TowerDraft[]) => void;
};

/**
 * Towers and their floors.
 *
 * Optional throughout — a housing scheme has no towers, while a high-rise
 * needs Tower -> Floor so individual units can be placed. Floors are numbered
 * rather than named: negative is a basement, 0 is ground.
 */
export default function ProjectTowersStep({ towers, onChange }: Props) {
  const update = (i: number, patch: Partial<TowerDraft>) =>
    onChange(towers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const remove = (i: number) => onChange(towers.filter((_, idx) => idx !== i));

  const addTower = () => onChange([...towers, { ...emptyTower, floors: [] }]);

  const addFloor = (i: number) => {
    const tower = towers[i];
    // Continue upward from the highest floor entered so far.
    const highest = tower.floors.reduce(
      (max, f) => Math.max(max, Number(f.floorNumber) || 0),
      -1,
    );
    update(i, {
      floors: [...tower.floors, { floorNumber: String(highest + 1), name: "" }],
    });
  };

  const updateFloor = (i: number, j: number, patch: Partial<FloorDraft>) =>
    update(i, {
      floors: towers[i].floors.map((f, idx) => (idx === j ? { ...f, ...patch } : f)),
    });

  const removeFloor = (i: number, j: number) =>
    update(i, { floors: towers[i].floors.filter((_, idx) => idx !== j) });

  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-900">Towers &amp; Floors</h3>
      <p className="mt-1 text-[12px] text-gray-500">
        Optional. Add towers for a high-rise so units can be placed on a
        specific floor. Skip this for housing schemes and plot projects.
      </p>

      {towers.length === 0 && (
        <p className="mt-5 rounded-md border border-dashed border-gray-200 py-8 text-center text-[11.5px] text-gray-400">
          No towers added. This project will list unit types without a tower
          breakdown.
        </p>
      )}

      <div className="mt-5 space-y-4">
        {towers.map((tower, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[12px] font-bold text-gray-800">
                Tower {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-100"
              >
                Remove
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                  Tower Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={tower.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="e.g. Tower A"
                  className={adminInputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                  Total Floors
                </label>
                <input
                  type="number" min={0} max={300}
                  value={tower.floorsCount}
                  onChange={(e) => update(i, { floorsCount: e.target.value })}
                  placeholder="12"
                  className={adminInputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                  Total Units
                </label>
                <input
                  type="number" min={0} max={10000}
                  value={tower.unitsCount}
                  onChange={(e) => update(i, { unitsCount: e.target.value })}
                  placeholder="48"
                  className={adminInputClass}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Description
              </label>
              <textarea
                rows={2}
                value={tower.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Optional notes about this tower..."
                className={adminTextareaClass}
              />
            </div>

            {/* Floors */}
            <div className="mt-4 rounded-md border border-gray-100 bg-gray-50/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-semibold text-gray-700">
                  Floors ({tower.floors.length})
                </span>
                <button
                  type="button"
                  onClick={() => addFloor(i)}
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:border-primary hover:text-primary"
                >
                  + Add floor
                </button>
              </div>

              {tower.floors.length === 0 ? (
                <p className="mt-2 text-[10.5px] text-gray-400">
                  No floors yet. Use a negative number for basements and 0 for
                  the ground floor.
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  {tower.floors.map((floor, j) => (
                    <div key={j} className="flex items-end gap-2">
                      <div className="w-28 shrink-0">
                        <label className="mb-1 block text-[10px] font-medium text-gray-500">
                          Floor number
                        </label>
                        <input
                          type="number" min={-20} max={300}
                          value={floor.floorNumber}
                          onChange={(e) => updateFloor(i, j, { floorNumber: e.target.value })}
                          className={adminInputClass}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block text-[10px] font-medium text-gray-500">
                          Name (optional)
                        </label>
                        <input
                          value={floor.name}
                          onChange={(e) => updateFloor(i, j, { name: e.target.value })}
                          placeholder={floorLabel(floor.floorNumber)}
                          className={adminInputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFloor(i, j)}
                        aria-label="Remove floor"
                        className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTower}
        className="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-2 text-[12px] font-semibold text-gray-600 hover:border-primary hover:text-primary"
      >
        + Add tower
      </button>
    </div>
  );
}

/** Mirrors the backend naming so the placeholder matches what gets saved. */
function floorLabel(value: string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "Floor name";
  if (n < 0) return `Basement ${Math.abs(n)}`;
  if (n === 0) return "Ground Floor";

  const suffix = [11, 12, 13].includes(n % 100)
    ? "th"
    : n % 10 === 1
      ? "st"
      : n % 10 === 2
        ? "nd"
        : n % 10 === 3
          ? "rd"
          : "th";

  return `${n}${suffix} Floor`;
}

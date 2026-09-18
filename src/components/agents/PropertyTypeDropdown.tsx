"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  HouseIcon,
  ApartmentIcon,
  UpperPortionIcon,
  LowerPortionIcon,
  FarmHouseIcon,
  RoomIcon,
  PenthouseIcon,
  PlotIcon,
  ResidentialPlotIcon,
  CommercialPlotIcon,
  AgriculturalIcon,
  FarmLandIcon,
  CommercialIcon,
  ShopIcon,
  OfficeIcon,
  BuildingIcon,
  WarehouseIcon,
  FactoryIcon,
  CheckIcon,
} from "@/components/ui/Icons";

export const propertyCategories = [
  { id: "homes", label: "Homes", value: "homes" },
  { id: "plots", label: "Plots", value: "plots" },
  { id: "commercial", label: "Commercial", value: "commercial" },
];

export const homesSubtypes = [
  { label: "View All", value: "homes", icon: HomeIcon },
  { label: "Houses", value: "House", icon: HouseIcon },
  { label: "Flat", value: "Flat", icon: ApartmentIcon },
  { label: "Upper Portion", value: "Upper Portion", icon: UpperPortionIcon },
  { label: "Lower Portion", value: "Lower Portion", icon: LowerPortionIcon },
  { label: "Farm House", value: "Farm House", icon: FarmHouseIcon },
  { label: "Room", value: "Room", icon: RoomIcon },
  { label: "Penthouse", value: "Penthouse", icon: PenthouseIcon },
];

export const plotsSubtypes = [
  { label: "View All", value: "plots", icon: PlotIcon },
  { label: "Residential Plot", value: "Residential Plot", icon: ResidentialPlotIcon },
  { label: "Commercial Plot", value: "Commercial Plot", icon: CommercialPlotIcon },
  { label: "Agricultural Land", value: "Agricultural Land", icon: AgriculturalIcon },
  { label: "Farm Land", value: "Farm Land", icon: FarmLandIcon },
];

export const commercialSubtypes = [
  { label: "View All", value: "commercial", icon: CommercialIcon },
  { label: "Shop", value: "Shop", icon: ShopIcon },
  { label: "Office", value: "Office", icon: OfficeIcon },
  { label: "Building", value: "Building", icon: BuildingIcon },
  { label: "Warehouse", value: "Warehouse", icon: WarehouseIcon },
  { label: "Factory", value: "Factory", icon: FactoryIcon },
  { label: "Commercial Plot", value: "Commercial Plot", icon: CommercialPlotIcon },
];

type PropertyTypeDropdownProps = {
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function PropertyTypeDropdown({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: PropertyTypeDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine active category based on value
  const [activeCategory, setActiveCategory] = useState<string>("homes");

  useEffect(() => {
    if (!value) {
      setActiveCategory("homes");
    } else if (value === "homes" || homesSubtypes.some(s => s.value.toLowerCase() === value.toLowerCase())) {
      setActiveCategory("homes");
    } else if (value === "plots" || plotsSubtypes.some(s => s.value.toLowerCase() === value.toLowerCase())) {
      setActiveCategory("plots");
    } else if (value === "commercial" || commercialSubtypes.some(s => s.value.toLowerCase() === value.toLowerCase())) {
      setActiveCategory("commercial");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get display label
  function getDisplayLabel() {
    if (!value) return "Property Type";
    if (value === "homes") return "Homes";
    if (value === "plots") return "Plots";
    if (value === "commercial") return "Commercial";
    // Check subtypes
    const allSubs = [...homesSubtypes, ...plotsSubtypes, ...commercialSubtypes];
    const found = allSubs.find(s => s.value.toLowerCase() === value.toLowerCase());
    return found ? found.label : value;
  }

  const currentSubtypes =
    activeCategory === "homes"
      ? homesSubtypes
      : activeCategory === "plots"
      ? plotsSubtypes
      : activeCategory === "commercial"
      ? commercialSubtypes
      : [];

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <label className="text-[11px] font-semibold text-muted">Property Type</label>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-[13px] text-heading outline-none transition-colors ${
          isOpen ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-border hover:border-primary"
        }`}
      >
        <span className="truncate font-medium">{getDisplayLabel()}</span>
        {isOpen ? <ChevronUpIcon className="h-4 w-4 text-primary" /> : <ChevronDownIcon className="h-4 w-4 text-muted" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[320px] sm:w-[440px] rounded-xl border border-border bg-white p-4 shadow-xl">
          {/* Category Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-border pb-3">
            {propertyCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-center text-[13px] font-semibold transition-all ${
                    isActive
                      ? "bg-primary-light border border-primary text-primary shadow-sm"
                      : "bg-surface text-heading hover:bg-border/40 border border-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Subtypes Grid / List */}
          {activeCategory !== "all" && (
            <div className="mt-3 max-h-[300px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentSubtypes.map((sub) => {
                  const IconComp = sub.icon;
                  const isSelected = value.toLowerCase() === sub.value.toLowerCase();
                  return (
                    <button
                      key={sub.label}
                      type="button"
                      onClick={() => {
                        onChange(sub.value);
                        onClose();
                      }}
                      className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left text-[13px] font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary-light text-primary shadow-sm"
                          : "border-border/60 bg-white text-heading hover:border-primary hover:bg-surface"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          isSelected ? "bg-primary text-white" : "bg-surface text-primary"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      <span className="flex-1 truncate">{sub.label}</span>
                      {isSelected && <CheckIcon className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

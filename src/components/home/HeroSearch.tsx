"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  LocationPinIcon,
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
  ShopIcon,
  OfficeIcon,
  BuildingIcon,
  WarehouseIcon,
  FactoryIcon,
  CommercialIcon,
  BedIcon,
  PriceIcon,
  AreaIcon,
} from "@/components/ui/Icons";

const cities = [
  "Islamabad",
  "Karachi",
  "Lahore",
  "Rawalpindi",
  "Abbottabad",
  "Abdul Hakim",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Sargodha",
  "Gujranwala",
];

const locationSuggestions = [
  { name: "DHA Phase 2", type: "area" },
  { name: "DHA Phase 5", type: "area" },
  { name: "DHA Phase 6", type: "area" },
  { name: "DHA Lahore", type: "society" },
  { name: "Bahria Town", type: "society" },
  { name: "Gulberg", type: "area" },
  { name: "F-7", type: "area" },
  { name: "F-8", type: "area" },
  { name: "G-11", type: "area" },
  { name: "E-11", type: "area" },
];

type PropertySearchState = {
  purpose: "buy" | "rent";
  city: string;
  location: string;
  propertyType: string;
  propertySubType: string;
  areaUnit: "marla" | "kanal" | "sqft" | "sqyd";
  areaMin: string;
  areaMax: string;
  beds: string;
  priceCurrency: "PKR" | "USD" | "AED" | "SAR";
  priceMin: string;
  priceMax: string;
};

type PropertyCategoryKey = "homes" | "plots" | "commercial";

type PropertySubTypeItem = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const propertyCategoriesData: {
  category: string;
  value: PropertyCategoryKey;
  items: PropertySubTypeItem[];
}[] = [
  {
    category: "Homes",
    value: "homes",
    items: [
      { label: "All Homes", value: "all-homes", icon: HomeIcon },
      { label: "House", value: "house", icon: HouseIcon },
      { label: "Flat", value: "flat", icon: ApartmentIcon },
      { label: "Upper Portion", value: "upper-portion", icon: UpperPortionIcon },
      { label: "Lower Portion", value: "lower-portion", icon: LowerPortionIcon },
      { label: "Farm House", value: "farm-house", icon: FarmHouseIcon },
      { label: "Room", value: "room", icon: RoomIcon },
      { label: "Penthouse", value: "penthouse", icon: PenthouseIcon },
      { label: "Apartment", value: "apartment", icon: ApartmentIcon },
    ],
  },
  {
    category: "Plots",
    value: "plots",
    items: [
      { label: "All Plots", value: "all-plots", icon: PlotIcon },
      { label: "Residential Plot", value: "residential-plot", icon: ResidentialPlotIcon },
      { label: "Commercial Plot", value: "commercial-plot", icon: CommercialPlotIcon },
      { label: "Agricultural Land", value: "agricultural-land", icon: AgriculturalIcon },
      { label: "Farm Land", value: "farm-land", icon: FarmLandIcon },
    ],
  },
  {
    category: "Commercial",
    value: "commercial",
    items: [
      { label: "All Commercial", value: "all-commercial", icon: CommercialIcon },
      { label: "Shop", value: "shop", icon: ShopIcon },
      { label: "Office", value: "office", icon: OfficeIcon },
      { label: "Building", value: "building", icon: BuildingIcon },
      { label: "Warehouse", value: "warehouse", icon: WarehouseIcon },
      { label: "Factory", value: "factory", icon: FactoryIcon },
      { label: "Commercial Plot", value: "commercial-plot", icon: CommercialPlotIcon },
    ],
  },
];

export default function HeroSearch() {
  const router = useRouter();
  
  const [searchState, setSearchState] = useState<PropertySearchState>({
    purpose: "buy",
    city: "Islamabad",
    location: "",
    propertyType: "homes",
    propertySubType: "All Homes",
    areaUnit: "marla",
    areaMin: "",
    areaMax: "",
    beds: "",
    priceCurrency: "PKR",
    priceMin: "",
    priceMax: "",
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isBedsVisible = searchState.propertyType === "homes";

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const updateState = (updates: Partial<PropertySearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updates }));
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(searchState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/properties?${params.toString()}`);
  }

  const areaUnits = [
    { key: "marla", label: "Marla" },
    { key: "kanal", label: "Kanal" },
    { key: "sqft", label: "Sq. Ft." },
    { key: "sqyd", label: "Sq. Yd." },
  ] as const;

  const areaLabel = searchState.areaMin || searchState.areaMax
    ? `${searchState.areaMin || "0"} - ${searchState.areaMax || "Any"} ${areaUnits.find(u => u.key === searchState.areaUnit)?.label || "Marla"}`
    : `Area (${areaUnits.find(u => u.key === searchState.areaUnit)?.label || "Marla"})`;

  const priceLabel = searchState.priceMin || searchState.priceMax
    ? `${searchState.priceMin || "0"} - ${searchState.priceMax || "Any"} ${searchState.priceCurrency}`
    : `Price (${searchState.priceCurrency})`;

  return (
    <div ref={containerRef} className="w-full max-w-[1100px]">
      {/* Purpose Tabs: Buy / Rent */}
      <div className="mb-3 flex w-full rounded-full bg-white/95 p-1 shadow-lg sm:inline-flex sm:w-auto">
        <button
          type="button"
          onClick={() => updateState({ purpose: "buy" })}
          className={`flex-1 rounded-full px-6 py-2 text-[13px] font-semibold transition-all sm:flex-initial sm:px-8 ${
            searchState.purpose === "buy"
              ? "bg-primary text-white shadow-sm"
              : "text-heading hover:text-primary"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => updateState({ purpose: "rent" })}
          className={`flex-1 rounded-full px-6 py-2 text-[13px] font-semibold transition-all sm:flex-initial sm:px-8 ${
            searchState.purpose === "rent"
              ? "bg-primary text-white shadow-sm"
              : "text-heading hover:text-primary"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Search Form - Two-row layout */}
      <form onSubmit={handleSearch} className="rounded-lg bg-white p-3.5 shadow-xl sm:p-4">
        <div className="space-y-2.5">
          {/* Row 1: City (smaller), Location Search (wider), Property Type (smaller) */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_2.4fr_1.1fr]">
            
            {/* 1. City Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("city")}
                className="flex h-[46px] w-full items-center justify-between rounded-md border border-border bg-white px-3.5 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <LocationPinIcon className="h-[18px] w-[18px] text-muted shrink-0" />
                  <span className="truncate font-medium">{searchState.city}</span>
                </div>
                {activeDropdown === "city" ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                )}
              </button>
              {activeDropdown === "city" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[220px] rounded-md border border-border bg-white p-1 shadow-xl">
                  <div className="p-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search city"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full rounded border border-border px-3 py-2 text-[13px] outline-none focus:border-primary"
                    />
                  </div>
                  <ul className="max-h-60 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {cities
                      .filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
                      .map((c) => {
                        const isSelected = searchState.city === c;
                        return (
                          <li key={c}>
                            <button
                              type="button"
                              onClick={() => {
                                updateState({ city: c });
                                setActiveDropdown(null);
                                setCitySearch("");
                              }}
                              className={`flex w-full items-center px-4 py-2.5 text-left text-[14px] transition-colors ${
                                isSelected
                                  ? "bg-primary-light font-semibold text-primary"
                                  : "text-text hover:bg-surface"
                              }`}
                            >
                              {c}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Location Search */}
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchState.location}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState({ location: val });
                  if (val.trim().length > 0) {
                    setActiveDropdown("location");
                  } else {
                    setActiveDropdown(null);
                  }
                }}
                onFocus={() => {
                  if (searchState.location.trim().length > 0) {
                    setActiveDropdown("location");
                  }
                }}
                placeholder="Search by Location"
                className="h-[46px] w-full rounded-md border border-border bg-white pl-10 pr-3 text-[13px] text-heading outline-none transition-colors placeholder:text-muted hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              {activeDropdown === "location" && searchState.location.trim().length > 0 && (
                <ul className="absolute left-0 top-full z-50 mt-1.5 max-h-60 w-full min-w-[280px] overflow-y-auto rounded-md border border-border bg-white py-1 shadow-xl">
                  {locationSuggestions
                    .filter((item) =>
                      item.name.toLowerCase().includes(searchState.location.toLowerCase())
                    )
                    .map((item) => (
                      <li key={item.name}>
                        <button
                          type="button"
                          onClick={() => {
                            updateState({ location: item.name });
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-text hover:bg-surface transition-colors"
                        >
                          {item.type === "society" ? (
                            <BuildingIcon className="h-3.5 w-3.5 text-muted shrink-0" />
                          ) : (
                            <LocationPinIcon className="h-3.5 w-3.5 text-muted shrink-0" />
                          )}
                          <span className="truncate">{item.name}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* 3. Property Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("propertyType")}
                className="flex h-[46px] w-full items-center justify-between rounded-md border border-border bg-white px-3.5 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
              >
                <span className="truncate font-medium">
                  {searchState.propertySubType || "Property Type"}
                </span>
                {activeDropdown === "propertyType" ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                )}
              </button>

              {activeDropdown === "propertyType" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-[390px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-white p-3 shadow-2xl">
                  {/* Top Tabs: Homes | Plots | Commercial */}
                  <div className="flex rounded-lg bg-surface p-1 mb-3">
                    {propertyCategoriesData.map((cat) => {
                      const isActive = searchState.propertyType === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => updateState({ propertyType: cat.value })}
                          className={`flex-1 py-2 text-center text-[13px] font-semibold rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "text-text hover:text-primary"
                          }`}
                        >
                          {cat.category}
                        </button>
                      );
                    })}
                  </div>

                  {/* Two-Column Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {propertyCategoriesData
                      .find((c) => c.value === searchState.propertyType)
                      ?.items.map((item) => {
                        const isSelected = searchState.propertySubType === item.label;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              updateState({ propertySubType: item.label });
                              setActiveDropdown(null);
                            }}
                            className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left text-[12px] transition-all ${
                              isSelected
                                ? "border-primary bg-primary-light font-semibold text-primary shadow-sm"
                                : "border-border bg-white text-text hover:border-primary hover:bg-primary-light/20"
                            }`}
                          >
                            <IconComponent
                              className={`h-[18px] w-[18px] shrink-0 ${
                                isSelected ? "text-primary" : "text-muted"
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Row 2: Area, Beds (if visible), Price Range, Search Property Button */}
          <div className={`grid gap-2.5 sm:grid-cols-2 ${isBedsVisible ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            
            {/* 4. Area Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("area")}
                className="flex h-[46px] w-full items-center justify-between rounded-md border border-border bg-white px-3.5 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <AreaIcon className="h-[18px] w-[18px] text-muted shrink-0" />
                  <span className="truncate">{areaLabel}</span>
                </div>
                {activeDropdown === "area" ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                )}
              </button>
              {activeDropdown === "area" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-md border border-border bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between border-b pb-2">
                    <span className="text-[13px] font-bold text-heading">
                      Area ({areaUnits.find(u => u.key === searchState.areaUnit)?.label || "Marla"})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const units: ("marla" | "kanal" | "sqft" | "sqyd")[] = ["marla", "kanal", "sqft", "sqyd"];
                        const nextIndex = (units.indexOf(searchState.areaUnit) + 1) % units.length;
                        updateState({ areaUnit: units[nextIndex] });
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Change Area Unit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Minimum</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={searchState.areaMin}
                        onChange={(e) => updateState({ areaMin: e.target.value })}
                        className="w-full rounded border border-border px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Maximum</label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={searchState.areaMax}
                        onChange={(e) => updateState({ areaMax: e.target.value })}
                        className="w-full rounded border border-border px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <button
                      type="button"
                      onClick={() => updateState({ areaMin: "", areaMax: "" })}
                      className="text-[13px] font-semibold text-heading hover:text-primary"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(null)}
                      className="rounded bg-primary px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Beds Dropdown */}
            {isBedsVisible && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("beds")}
                  className="flex h-[46px] w-full items-center justify-between rounded-md border border-border bg-white px-3.5 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
                >
                  <div className="flex items-center gap-2 truncate">
                    <BedIcon className="h-[18px] w-[18px] text-muted shrink-0" />
                    <span className="truncate">
                      {searchState.beds
                        ? (searchState.beds === "Studio" ? "Studio" : `${searchState.beds} Beds`)
                        : "Beds"}
                    </span>
                  </div>
                  {activeDropdown === "beds" ? (
                    <ChevronUpIcon className="h-3.5 w-3.5 text-muted" />
                  ) : (
                    <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                  )}
                </button>
                {activeDropdown === "beds" && (
                  <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-md border border-border bg-white p-4 shadow-xl">
                    <span className="mb-3 block text-[13px] font-bold text-heading">Beds</span>
                    <div className="grid grid-cols-5 gap-2">
                      {["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((opt) => {
                        const isSelected = searchState.beds === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              updateState({ beds: opt });
                              setActiveDropdown(null);
                            }}
                            className={`flex h-9 items-center justify-center rounded-md border text-[12px] font-medium transition-all ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-white text-text hover:border-primary hover:text-primary"
                            } ${opt === "Studio" || opt === "10+" ? "col-span-2" : "col-span-1"}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(null)}
                        className="w-full rounded bg-primary py-2 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Price Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("price")}
                className="flex h-[46px] w-full items-center justify-between rounded-md border border-border bg-white px-3.5 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <PriceIcon className="h-[18px] w-[18px] text-muted shrink-0" />
                  <span className="truncate">{priceLabel}</span>
                </div>
                {activeDropdown === "price" ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                )}
              </button>
              {activeDropdown === "price" && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-md border border-border bg-white p-4 shadow-xl lg:left-0 lg:right-auto">
                  <div className="mb-3 flex items-center justify-between border-b pb-2">
                    <span className="text-[13px] font-bold text-heading">Price ({searchState.priceCurrency})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currencies: ("PKR" | "USD" | "AED" | "SAR")[] = ["PKR", "USD", "AED", "SAR"];
                        const nextIndex = (currencies.indexOf(searchState.priceCurrency) + 1) % currencies.length;
                        updateState({ priceCurrency: currencies[nextIndex] });
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Change Currency
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Minimum</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={searchState.priceMin}
                        onChange={(e) => updateState({ priceMin: e.target.value })}
                        className="w-full rounded border border-border px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-muted uppercase">Maximum</label>
                      <input
                        type="number"
                        placeholder="Any"
                        value={searchState.priceMax}
                        onChange={(e) => updateState({ priceMax: e.target.value })}
                        className="w-full rounded border border-border px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <button
                      type="button"
                      onClick={() => updateState({ priceMin: "", priceMax: "" })}
                      className="text-[13px] font-semibold text-heading hover:text-primary"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(null)}
                      className="rounded bg-primary px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Search Button */}
            <button
              type="submit"
              className="flex h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <SearchIcon className="h-4 w-4 text-white" />
              Search Property
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}

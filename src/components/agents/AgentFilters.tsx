"use client";

import { useState, useEffect } from "react";
import { SearchIcon, ResetIcon, CloseIcon } from "@/components/ui/Icons";
import PropertyTypeDropdown from "@/components/agents/PropertyTypeDropdown";
import CityDropdown from "@/components/agents/CityDropdown";
import LocationDropdown from "@/components/agents/LocationDropdown";
import CompanyDropdown from "@/components/agents/CompanyDropdown";

type AgentFiltersProps = {
  propertyType: string;
  city: string;
  location: string;
  companyName: string;
  onFilterChange: (filters: {
    propertyType: string;
    city: string;
    location: string;
    companyName: string;
  }) => void;
  onReset: () => void;
};

export default function AgentFilters({
  propertyType,
  city,
  location,
  companyName,
  onFilterChange,
  onReset,
}: AgentFiltersProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyType);
  const [selectedCity, setSelectedCity] = useState(city);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [selectedCompany, setSelectedCompany] = useState(companyName);

  // Single open dropdown state: only one can be open at a time
  const [openDropdown, setOpenDropdown] = useState<
    "propertyType" | "city" | "location" | "company" | null
  >(null);

  // Sync internal state when props change
  useEffect(() => {
    setSelectedPropertyType(propertyType);
    setSelectedCity(city);
    setSelectedLocation(location);
    setSelectedCompany(companyName);
  }, [propertyType, city, location, companyName]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpenDropdown(null);
    onFilterChange({
      propertyType: selectedPropertyType,
      city: selectedCity,
      location: selectedLocation,
      companyName: selectedCompany,
    });
  }

  const hasActiveFilters = Boolean(
    propertyType || city || location || companyName
  );

  return (
    <section className="py-6">
      <div className="container-page">
        {/* White filter card */}
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            {/* Property Type Custom Dropdown */}
            <PropertyTypeDropdown
              value={selectedPropertyType}
              onChange={(val) => {
                setSelectedPropertyType(val);
                // Optionally trigger search immediately or leave for search button
              }}
              isOpen={openDropdown === "propertyType"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")
              }
              onClose={() => setOpenDropdown(null)}
            />

            {/* City Custom Dropdown */}
            <CityDropdown
              value={selectedCity}
              onChange={(val) => {
                setSelectedCity(val);
              }}
              isOpen={openDropdown === "city"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "city" ? null : "city")
              }
              onClose={() => setOpenDropdown(null)}
            />

            {/* Location Custom Dropdown */}
            <LocationDropdown
              value={selectedLocation}
              onChange={(val) => {
                setSelectedLocation(val);
              }}
              isOpen={openDropdown === "location"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "location" ? null : "location")
              }
              onClose={() => setOpenDropdown(null)}
            />

            {/* Company Name Custom Dropdown */}
            <CompanyDropdown
              value={selectedCompany}
              onChange={(val) => {
                setSelectedCompany(val);
              }}
              isOpen={openDropdown === "company"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "company" ? null : "company")
              }
              onClose={() => setOpenDropdown(null)}
            />

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark sm:w-auto"
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Active Filter Chips & Clear All */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-muted">Active Filters:</span>

            {city && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[12px] font-semibold text-primary">
                City: {city}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("");
                    onFilterChange({
                      propertyType,
                      city: "",
                      location,
                      companyName,
                    });
                  }}
                  className="hover:opacity-75"
                  aria-label="Remove city filter"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {propertyType && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[12px] font-semibold text-primary">
                Type: {propertyType}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPropertyType("");
                    onFilterChange({
                      propertyType: "",
                      city,
                      location,
                      companyName,
                    });
                  }}
                  className="hover:opacity-75"
                  aria-label="Remove property type filter"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[12px] font-semibold text-primary">
                Location: {location}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation("");
                    onFilterChange({
                      propertyType,
                      city,
                      location: "",
                      companyName,
                    });
                  }}
                  className="hover:opacity-75"
                  aria-label="Remove location filter"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {companyName && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[12px] font-semibold text-primary">
                Company: {companyName}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany("");
                    onFilterChange({
                      propertyType,
                      city,
                      location,
                      companyName: "",
                    });
                  }}
                  className="hover:opacity-75"
                  aria-label="Remove company filter"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedPropertyType("");
                setSelectedCity("");
                setSelectedLocation("");
                setSelectedCompany("");
                onReset();
              }}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition-colors hover:underline"
            >
              <ResetIcon className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

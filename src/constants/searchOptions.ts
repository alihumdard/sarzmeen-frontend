/**
 * Mock options for the hero search bar.
 *
 * V1 uses static data — these arrays get replaced by the Laravel API response
 * later, so the shape is kept simple: { label, value }.
 */

export type SelectOption = {
  label: string;
  value: string;
};

export const cities: SelectOption[] = [
  { label: "Karachi", value: "karachi" },
  { label: "Lahore", value: "lahore" },
  { label: "Islamabad", value: "islamabad" },
  { label: "Rawalpindi", value: "rawalpindi" },
  { label: "Faisalabad", value: "faisalabad" },
  { label: "Multan", value: "multan" },
  { label: "Peshawar", value: "peshawar" },
  { label: "Quetta", value: "quetta" },
];

export const locations: SelectOption[] = [
  { label: "DHA", value: "dha" },
  { label: "Bahria Town", value: "bahria-town" },
  { label: "Gulberg", value: "gulberg" },
  { label: "Clifton", value: "clifton" },
  { label: "Model Town", value: "model-town" },
  { label: "Johar Town", value: "johar-town" },
];

export const propertyTypes: SelectOption[] = [
  { label: "House", value: "house" },
  { label: "Flat / Apartment", value: "flat" },
  { label: "Upper Portion", value: "upper-portion" },
  { label: "Lower Portion", value: "lower-portion" },
  { label: "Farm House", value: "farm-house" },
  { label: "Residential Plot", value: "residential-plot" },
  { label: "Commercial Plot", value: "commercial-plot" },
  { label: "Shop", value: "shop" },
  { label: "Office", value: "office" },
];

/** Sidebar property-type filter, with mock result counts. */
export const propertyTypeFilters = [
  { label: "House", value: "house", count: 5299 },
  { label: "Plot", value: "plot", count: 4012 },
  { label: "Flat", value: "flat", count: 1952 },
  { label: "Commercial", value: "commercial", count: 1299 },
  { label: "Apartment", value: "apartment", count: 1287 },
];

/** Sidebar amenity filter. */
export const propertyFeatureFilters = [
  { label: "Furnished", value: "furnished" },
  { label: "Park Facing", value: "park-facing" },
  { label: "Corner", value: "corner" },
  { label: "Double Story", value: "double-story" },
  { label: "Servant Quarter", value: "servant-quarter" },
  { label: "Basement", value: "basement" },
  { label: "CCTV", value: "cctv" },
  { label: "Lawn", value: "lawn" },
];

/** Bedroom / bathroom chip filters. */
export const roomCountOptions = ["1", "2", "3", "4", "5", "6+"];

/** Bedroom counts for the hero search bar. */
export const bedOptions: SelectOption[] = [
  { label: "1 Bed", value: "1" },
  { label: "2 Beds", value: "2" },
  { label: "3 Beds", value: "3" },
  { label: "4 Beds", value: "4" },
  { label: "5 Beds", value: "5" },
  { label: "6+ Beds", value: "6" },
];

/** Plot sizes for the hero search bar, in Marla. */
export const areaOptions: SelectOption[] = [
  { label: "3 Marla", value: "3" },
  { label: "5 Marla", value: "5" },
  { label: "10 Marla", value: "10" },
  { label: "1 Kanal", value: "20" },
  { label: "2 Kanal", value: "40" },
];

/** Areas used by the sidebar area filter, in Marla. */
export const areaUnits: SelectOption[] = [
  { label: "Min", value: "" },
  { label: "3 Marla", value: "3" },
  { label: "5 Marla", value: "5" },
  { label: "10 Marla", value: "10" },
  { label: "1 Kanal", value: "20" },
  { label: "2 Kanal", value: "40" },
];

export const priceRanges: SelectOption[] = [
  { label: "Under 50 Lac", value: "0-5000000" },
  { label: "50 Lac - 1 Crore", value: "5000000-10000000" },
  { label: "1 - 2 Crore", value: "10000000-20000000" },
  { label: "2 - 5 Crore", value: "20000000-50000000" },
  { label: "5 Crore & Above", value: "50000000-" },
];

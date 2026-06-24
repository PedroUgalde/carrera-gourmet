export type UserRole = "tourist" | "vendor";

export type City = "CDMX" | "Guadalajara" | "Monterrey";

export type ReservationStatus = "confirmed" | "cancelled" | "completed";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  location_name: string;
  city: City;
  latitude: number;
  longitude: number;
  capacity_total: number;
  hours: Record<string, string>;
  tags: string[];
  created_at: string;
}

export interface MenuItem {
  id: string;
  vendor_id: string;
  item_name: string;
  description_original: string;
  description_translated: string | null;
  price: number;
  tags: string[];
  created_at: string;
}

export interface Reservation {
  id: string;
  tourist_id: string;
  vendor_id: string;
  status: ReservationStatus;
  party_size: number;
  reservation_time: string;
  created_at: string;
}

export interface VendorCapacity {
  vendor_id: string;
  capacity_total: number;
  occupied: number;
  available: number;
}

export interface MenuItemInput {
  item_name: string;
  description_original: string;
  description_translated?: string;
  price: number;
  tags?: string[];
}

export interface RecommendRequest {
  latitude: number;
  longitude: number;
  preferences: string[];
  party_size: number;
  budget?: string;
}

export interface RecommendedVendor {
  id: string;
  name: string;
  location_name: string;
  city: City;
  latitude: number;
  longitude: number;
  capacity_total: number;
  available: number;
  tags: string[];
  distance_km: number;
  score: number;
  menus: MenuItem[];
}

export const CITY_COORDS: Record<City, { lat: number; lng: number }> = {
  CDMX: { lat: 19.4326, lng: -99.1332 },
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Monterrey: { lat: 25.6866, lng: -100.3161 },
};

export const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
  $: { min: 0, max: 60 },
  $$: { min: 40, max: 120 },
  $$$: { min: 100, max: 9999 },
};

export const DIETARY_OPTIONS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Keto",
  "No Pork",
  "Spicy",
  "Traditional",
] as const;

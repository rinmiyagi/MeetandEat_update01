/**
 * Common Type Definitions
 *
 * This file consolidates type definitions used across multiple components and hooks
 * to improve code organization and avoid circular dependencies.
 */

// --- from votingUtils.ts ---
export type CellValue = "circle" | "cross" | null;

export type Row = {
    labelLines: string[];
    cells: CellValue[];
    highlight?: boolean;
};

// --- from useResultData.ts ---
export type Participant = {
    id: string;
    name: string | null;
    dates: string[];
};

export type EventData = {
    amount: number;
    confirmed_date: string | null;
    restaurant_info: any; // Ideally this should be typed more strictly if possible, maybe reusing Restaurant type?
    target_station: string | null;
}

// --- from useLocationSearch.ts ---
export type NominatimAddress = {
    province?: string;
    city?: string;
    town?: string;
    village?: string;
    ward?: string;
    city_district?: string;
    suburb?: string;
    neighbourhood?: string;
    road?: string;
    house_number?: string;
    amenity?: string;
    building?: string;
    shop?: string;
    office?: string;
    tourism?: string;
    historic?: string;
    [key: string]: string | undefined;
};

export type NominatimResult = {
    display_name: string;
    lat: string;
    lon: string;
    address?: NominatimAddress;
};

// --- from RestaurantCard.tsx ---
export type Restaurant = {
    name: string;
    address: string;
    urls: { pc: string };
    genre?: { name: string };
    photo?: { pc: { l: string } };
    budget?: { name: string; average: string };
    catch?: string;
}

// --- from LocationSearch.tsx ---
export type LocationData = {
    name: string;
    lat: number;
    lng: number;
}

// --- from CalendarHeader.tsx ---
export type ViewType = 'day' | 'week' | 'month' | 'year';

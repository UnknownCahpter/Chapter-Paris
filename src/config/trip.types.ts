import { type ComponentType } from 'react';

// ── Location Types ────────────────────────────────────────

export type LocationType =
    | 'attraction'
    | 'food'
    | 'activity'
    | 'transport'
    | 'relax'
    | 'museum'
    | 'photo'
    | 'poker'
    | 'viewpoint'
    | 'flight'
    | 'shopping'
    | 'bus'
    | 'hotel'
    | 'bar'
    | 'church';

export interface Location {
    time: string;
    name: string;
    type: LocationType;
    tags?: string[];
    isOptional?: boolean;
    disableNavigation?: boolean;
    ticketStatus?: 'booked' | 'none';
}

export interface Day {
    id: string;
    title: string;
    date: string;
    locations: Location[];
}

export interface SurvivalPhrase {
    icon: string;
    label: string;
    phrase: string;
    pronunciation: string;
    english: string;
}

export interface CheatSheetItem {
    icon: string;
    label: string;
    value: string;
}

export interface HotelInfo {
    name: string;
    addressLine1: string;
    addressLine2: string;
    fullAddress: string;
    driverLabel?: string;
}

export interface CurrencyConfig {
    codes: string[];
    defaultExpenseCurrency: string;
    defaultConverterBase: string;
    homeCurrency: string;
    homeSymbol: string;
    apiBaseCurrency: string;
    apiCurrencySymbol: string;
    fallbackRates: Record<string, number>;
    flags: Record<string, string>;
}

export interface AttractionData {
    desc: string;
    tips: string;
    funFacts?: string[];
    image?: string;
    imagePosition?: string;
    options?: ItineraryOption[];
    optionNote?: string;
}

export interface ItineraryOption {
    label: string;
    venueName?: string;
    title?: string;
    category?: string;
    priceRange?: string;
    rating?: number;
    address?: string;
    reservationUrl?: string;
    googleMapsUrl?: string;
    isMarcosPick?: boolean;
}

export interface EmergencyContact {
    icon: string;
    label: string;
    number: string;
    action: 'call' | 'info';
}

export interface Venue {
    name: string;
    city: string;
    tab: 'restaurant' | 'bar' | 'cafe' | 'grocery';
    category: string;
    address?: string;
    openingHours?: string;
    priceRange?: string;
    googleRating?: number;
    reviewCount?: number;
    reservationUrl?: string;
    phone?: string;
    remark?: string;
    isMarcosPick: boolean;
    googleMapsUrl?: string;
    photoUrls?: string[];
    photoSearchText?: string;
    photoAddress?: string;
}

export interface TripConfig {
    meta: {
        appName: string;
        shortName: string;
        title: string;
        subtitle: string;
        themeColor: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    defaultMapFallback: string;
    firebaseNamespace: string;
    itinerary: Day[];
    locationAddresses: Record<string, string>;
    attractionData: Record<string, AttractionData>;
    LogoComponent: ComponentType | null;
    introVideo: string | null;
    hotel: HotelInfo;
    ttsLanguageCode: string;
    ttsPreferredVoiceName?: string;
    ttsExcludedVoiceNames?: string[];
    survivalPhrasesTitle: string;
    survivalPhrases: SurvivalPhrase[];
    cheatSheetTitle: string;
    cheatSheet: CheatSheetItem[];
    currencies: CurrencyConfig;
    emergencyTitle: string;
    emergencyContacts: EmergencyContact[];
    clickableTransportTags: string[];
    uiStrings: {
        addItem: string;
        routeHint: string;
    };
    venues?: Venue[];
}

// ── Icon Mapping ──────────────────────────────────────────

export const getTypeIcon = (type: LocationType): string => {
    switch (type) {
        case 'attraction': return '⛩️';
        case 'food': return '🍽️';
        case 'activity': return '🚶';
        case 'transport': return '🚃';
        case 'relax': return '♨️';
        case 'museum': return '🏛️';
        case 'photo': return '📸';
        case 'poker': return '🃏';
        case 'viewpoint': return '🏞️';
        case 'flight': return '✈️';
        case 'shopping': return '🛍️';
        case 'bus': return '🚌';
        case 'hotel': return '🏨';
        case 'bar': return '🥂';
        case 'church': return '⛪';
        default: return '📍';
    }
};

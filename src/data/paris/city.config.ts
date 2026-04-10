// ============================================================
// CITY CONFIG TEMPLATE
// ============================================================
// Copy this file to src/config/city.config.ts and fill in
// every value marked with TODO.
// See TEMPLATE_GUIDE.md for the full setup walkthrough.
// ============================================================

// TODO: Uncomment and update these imports when setting up a new city.
// NOTE: If you copy this file to src/config/city.config.ts, adjust the relative paths:
//   '../assets/CityLogo'  → keep as-is
//   '../../config/trip.types' → change to './trip.types'
//   '../{city}/...'  → change to '../data/{city}/...'
// import CityLogo from '../assets/CityLogo';
// import type { TripConfig } from '../../config/trip.types';  // adjust path if copying to src/config/
// import { itinerary } from '../{city}/itinerary';
// import { locationAddresses } from '../{city}/locations';
// import { attractionData } from '../{city}/attractions';
// import { survivalPhrases } from '../{city}/phrases';
// import { cheatSheet } from '../{city}/cheatSheet';
// import { emergencyContacts } from '../{city}/emergency';
// import { venues } from '../{city}/venues';

// Placeholder types for the template file (remove when using real imports above)
type TripConfig = any;
const itinerary: any[] = [];
const locationAddresses: Record<string, string> = {};
const attractionData: Record<string, any> = {};
const survivalPhrases: any[] = [];
const cheatSheet: any[] = [];
const emergencyContacts: any[] = [];
const venues: any[] = [];

// ── Firebase namespace ────────────────────────────────────
// Used to namespace itinerary and expense data in Firebase Realtime DB.
// Use a unique string per trip, e.g. 'london_v1', 'paris_v1'.
export const firebaseNamespace = '{city}_v1'; // TODO

export const tripConfig: TripConfig = {

    meta: {
        appName: 'City & Region Trip',                         // TODO — also update public/manifest.json
        shortName: 'City',                                     // TODO — also update public/manifest.json
        title: 'Native title',                                 // TODO — also update index.html <title>
        subtitle: 'A trip subtitle line',                      // TODO
        themeColor: '#FFFFFF',                                 // TODO — also update index.html theme-color + manifest.json
    },

    coordinates: {
        latitude: 0.0,                                         // TODO — city centre lat
        longitude: 0.0,                                        // TODO — city centre lng
    },
    defaultMapFallback: 'City Name, Country',                  // TODO — fallback search string for map

    firebaseNamespace,

    itinerary,
    locationAddresses,
    attractionData,
    venues,

    LogoComponent: null,                                       // TODO — or import your logo component

    introVideo: null,                                          // TODO — or '/videos/intro.mp4'

    hotel: {
        name: 'Hotel Name',                                    // TODO
        addressLine1: 'Street Address',                        // TODO
        addressLine2: 'City, Country',                         // TODO
        fullAddress: 'Full Address for Maps',                  // TODO
        driverLabel: 'Take me here',                           // TODO — translate if needed
    },

    ttsLanguageCode: 'en-US',                                  // TODO — BCP 47 language tag for TTS

    survivalPhrasesTitle: '🗣️ Survival Phrases',              // TODO
    survivalPhrases,

    cheatSheetTitle: 'ℹ️ Cheat Sheet',                         // TODO
    cheatSheet,

    currencies: {
        codes: ['USD', 'EUR'],                                 // TODO — list of currency codes used
        defaultExpenseCurrency: 'EUR',                         // TODO — default for expense entry
        defaultConverterBase: 'EUR',                           // TODO — default converter source currency
        homeCurrency: 'USD',                                   // TODO — your home currency (shown as primary total)
        homeSymbol: '$',                                       // TODO — symbol for home currency
        apiBaseCurrency: 'EUR',                                // TODO — base for the exchange rate API call
        apiCurrencySymbol: '€',                                // TODO — symbol for api base currency
        fallbackRates: { USD: 1, EUR: 0.92 },                  // TODO — offline fallback rates vs apiBaseCurrency
        flags: {
            USD: '🇺🇸',                                       // TODO
            EUR: '🇪🇺',                                       // TODO
        },
    },

    emergencyTitle: '🆘 Emergency Contacts',                   // TODO — translate if needed
    emergencyContacts,

    // Tags that render as tappable route-guide links.
    // Must match tag strings used in itinerary.ts.
    clickableTransportTags: ['Metro', 'Bus', 'Train'],         // TODO — update for your transit system

    uiStrings: {
        addItem: 'Add Item',                                   // TODO — translate if needed
        routeHint: 'tap for route',                            // TODO — translate if needed
    },
};

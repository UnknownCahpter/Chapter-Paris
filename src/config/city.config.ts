import ParisLogo from '../assets/ParisLogo';
import type { TripConfig } from './trip.types';
import { itinerary } from '../data/paris/itinerary';
import { locationAddresses } from '../data/paris/locations';
import { attractionData } from '../data/paris/attractions';
import { survivalPhrases } from '../data/paris/phrases';
import { cheatSheet } from '../data/paris/cheatSheet';
import { emergencyContacts } from '../data/paris/emergency';
import { venues } from '../data/paris/venues';

// ── Firebase namespace ────────────────────────────────────
export const firebaseNamespace = 'paris_v1';

// ── Trip Config ───────────────────────────────────────────

export const tripConfig: TripConfig = {

    // ── Identity ──────────────────────────────────────────
    meta: {
        appName: 'Chapter Paris',
        shortName: 'Paris',
        title: 'Chapter Paris',
        subtitle: 'An Unknown Chapter Experience',
        themeColor: '#FDF3E7',
    },

    // ── Location ──────────────────────────────────────────
    coordinates: {
        latitude: 48.8566,
        longitude: 2.3522,
    },
    defaultMapFallback: 'Paris, France',

    // ── Firebase ──────────────────────────────────────────
    firebaseNamespace,

    // ── Data ──────────────────────────────────────────────
    itinerary,
    locationAddresses,
    attractionData,
    venues,

    // ── UI Components ─────────────────────────────────────
    LogoComponent: ParisLogo,
    introVideo: null,

    // ── Tools Tab ─────────────────────────────────────────
    hotel: {
        name: 'H\u00F4tel Le Senat',
        addressLine1: '10 Rue de Vaugirard, 75006 Paris',
        addressLine2: 'Apr 15\u201317 \u00B7 then Airbnb: 24 Rue Mouffetard (Apr 17\u201320)',
        fullAddress: '10 Rue de Vaugirard, 75006 Paris, France',
        driverLabel: 'Emmène-moi ici',
    },

    ttsLanguageCode: 'fr-FR',

    survivalPhrasesTitle: '\uD83D\uDDE3\uFE0F Survival French',
    survivalPhrases,

    cheatSheetTitle: '\u2139\uFE0F Paris Cheat Sheet',
    cheatSheet,

    // ── Wallet Tab ────────────────────────────────────────
    currencies: {
        codes: ['EUR', 'GBP', 'NZD'],
        defaultExpenseCurrency: 'EUR',
        defaultConverterBase: 'EUR',
        homeCurrency: 'NZD',
        homeSymbol: 'NZ$',
        apiBaseCurrency: 'EUR',
        apiCurrencySymbol: '\u20AC',
        fallbackRates: { EUR: 1, GBP: 0.86, NZD: 1.93 },
        flags: {
            EUR: '\uD83C\uDDEA\uD83C\uDDFA',
            GBP: '\uD83C\uDDEC\uD83C\uDDE7',
            NZD: '\uD83C\uDDF3\uD83C\uDDFF',
        },
    },

    // ── Emergency Contacts ────────────────────────────────
    emergencyTitle: '\uD83C\uDD98 Emergency Contacts',
    emergencyContacts,

    // ── Transport Tags ────────────────────────────────────
    clickableTransportTags: ['Metro', 'RER', 'Bus'],

    // ── UI Strings ────────────────────────────────────────
    uiStrings: {
        addItem: 'Add Item',
        routeHint: 'tap for route',
    },
};

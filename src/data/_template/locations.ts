// ── Location Addresses ────────────────────────────────────
// Maps itinerary location names to full address strings used
// by the Google Maps embed when the user taps "Navigate".
//
// Key:   The exact location name string from itinerary.ts
// Value: A geocodable address string
//
// Only include locations that have a specific address to navigate to.
// If a location name is not present here, the fallback is
// defaultMapFallback from city.config.ts.

export const locationAddresses: Record<string, string> = {
    // 'Example: Arrive at Airport': 'City International Airport, City, Country',
};

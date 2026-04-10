import type { Day } from '../../config/trip.types';

// ── Itinerary ─────────────────────────────────────────────
// One entry per day. Each day has an id, display title, date string,
// and a list of locations in chronological order.
//
// time:               4-digit 24h string, e.g. '0900', '2130'
// name:               Display name shown in the itinerary timeline
// type:               Controls the icon shown. See LocationType in trip.types.ts
// tags:               Optional labels. Tags matching clickableTransportTags
//                     in city.config.ts will render as tappable route links.
// isOptional:         Renders the item dimmed/greyed out
// disableNavigation:  Hides the navigate button (use for flights etc.)
// ticketStatus:       'booked' | 'none' — shows ticket badge when 'booked'

export const itinerary: Day[] = [
    {
        id: 'day-1',
        title: 'Day 1',
        date: 'MMM DD',
        // e.g. 'Mar 10'
        locations: [
            {
                time: '1200',
                name: 'Example: Arrive at Airport',
                type: 'flight',
                tags: ['Arrival'],
                disableNavigation: true,
            },
        ],
    },
    // Add more days by copying the block above...
];

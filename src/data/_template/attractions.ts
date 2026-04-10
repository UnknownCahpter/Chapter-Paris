import type { AttractionData } from '../../config/trip.types';

// ── Attraction & Restaurant Data ──────────────────────────
// Keys must exactly match the location name strings in itinerary.ts.
// Each entry provides the content shown in the story block when
// the user expands a location.
//
// desc:   Main description paragraph (supports \n for line breaks)
// tips:   Tips / fun facts section (supports \n for line breaks)
// image:  Optional image path. Place images at:
//         public/attractions/{city}/filename.png
//         and reference as '/attractions/{city}/filename.png'
//
// Transport entries (matching clickableTransportTags) show their
// desc/tips in a route guide modal instead of the story block.

export const attractionData: Record<string, AttractionData> = {
    // 'Example Location Name': {
    //     desc: 'Description of the place...',
    //     tips: 'Tips and fun facts...',
    //     image: '/attractions/{city}/example.png',
    // },
};

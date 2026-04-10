import type { Day } from '../../config/trip.types';

export const itinerary: Day[] = [
    {
        id: 'day-1',
        title: 'Day 1',
        date: '15 Apr · Wed · 4 guests',
        locations: [
            { time: '1:00pm', name: 'Arrival at Gare du Nord, followed by check-in', type: 'transport', tags: ['Arrival', '4 guests'] },
            { time: '2:30pm', name: 'Tea at Jugetsudo by Maruyama Nori', type: 'food', tags: ['Tea House', '75006'] },
            { time: '3:30pm', name: 'A leisurely stroll through the Jardin du Luxembourg', type: 'attraction', tags: ['Garden', 'Easy walk'] },
            { time: '5:30pm', name: 'Optional time to explore the Little Japan quarter around Rue Sainte-Anne', type: 'shopping', tags: ['Little Japan', 'Optional'], isOptional: true },
            { time: '6:00pm', name: 'Dinner at Pho 14 Opéra', type: 'food', tags: ['Casual dinner', 'No reservation'] },
        ],
    },
    {
        id: 'day-2',
        title: 'Day 2',
        date: '16 Apr · Thu · 3 guests · Jia-Min in class',
        locations: [
            { time: 'Morning', name: 'Breakfast at the hotel', type: 'hotel', tags: ['Easy start'], disableNavigation: true },
            { time: '10:00am', name: "Visit Marché Couvert Beauvau and Marché d'Aligre", type: 'shopping', tags: ['Market', '75012'] },
            { time: 'Late morning', name: 'Photo stop at Rue Crémieux', type: 'photo', tags: ['Photo stop', '75012'] },
            { time: 'Lunch', name: 'Lunch at Bistro S or TOWA Restaurant', type: 'food', tags: ['French-Japanese', "Marco's Pick"] },
            { time: 'Afternoon', name: 'A stroll along Canal Saint-Martin, followed by time to explore Rue Beaurepaire', type: 'activity', tags: ['Canal walk', '75010'] },
            { time: '5:00-6:00pm', name: 'Return to the hotel for a short rest', type: 'hotel', tags: ['Reset'], disableNavigation: true },
            { time: '6:30pm', name: 'Visit Le Bon Marché', type: 'shopping', tags: ['Department store', '75007'] },
            { time: '7:30pm', name: 'Dinner at Baillotte or La Jacobine', type: 'food', tags: ['6th arrondissement', 'Bistro choice'] },
        ],
    },
    {
        id: 'day-3',
        title: 'Day 3',
        date: '17 Apr · Fri · 3 guests · Jia-Min in class',
        locations: [
            { time: 'Morning', name: 'Breakfast at the hotel', type: 'hotel', tags: ['Easy start'], disableNavigation: true },
            { time: 'Morning', name: 'Visit the Panthéon', type: 'attraction', tags: ['5th arrondissement', 'History'] },
            { time: 'Late morning', name: 'Continue to Notre-Dame', type: 'church', tags: ['4th arrondissement', 'Icon'] },
            { time: 'Noon', name: 'Board the Bateaux-Mouches river cruise', type: 'activity', tags: ['Seine', 'Shared moment'] },
            { time: 'Lunch', name: 'Free time for lunch', type: 'food', tags: ['Flexible'], disableNavigation: true },
            { time: 'Early afternoon', name: 'Enjoy a leisurely afternoon in Saint-Germain, with visits to Citypharma, La Grande Épicerie, and Des Gâteaux et du Pain', type: 'shopping', tags: ['Saint-Germain', 'Browsing'] },
            { time: '4:00pm', name: 'Check in to the Airbnb', type: 'hotel', tags: ['Mouffetard', '75005'] },
            { time: '6:00pm', name: 'Visit G. Detou', type: 'shopping', tags: ['Foodie stop', 'Baking supplies'] },
            { time: 'Evening', name: 'Dinner at Maslow 1er or Daimant Saint-Honoré', type: 'food', tags: ['Vegetarian-friendly', 'Central Paris'] },
        ],
    },
    {
        id: 'day-4',
        title: 'Day 4',
        date: '18 Apr · Sat · 4 guests',
        locations: [
            { time: 'Full day', name: 'Versailles Cut-the-Queue Tour', type: 'attraction', tags: ['Palace', 'Gardens', 'Transport included'] },
            { time: 'Evening', name: 'A relaxed dinner at home or at a nearby walk-in restaurant', type: 'food', tags: ['Near Airbnb', 'Easy dinner'] },
        ],
    },
    {
        id: 'day-5',
        title: 'Day 5',
        date: '19 Apr · Sun · 4 guests',
        locations: [
            { time: 'Morning', name: 'Breakfast at the Airbnb or pastries on the go', type: 'food', tags: ['Flexible start'], disableNavigation: true },
            { time: 'Morning', name: 'Visit Champ de Mars, Pont de Bir-Hakeim, and Esplanade Joseph-Wresinski', type: 'photo', tags: ['Eiffel photo spots', 'Inception'] },
            { time: 'Late morning', name: 'Photo stop at the Arc de Triomphe (exterior only)', type: 'photo', tags: ['Exterior only'] },
            { time: 'Lunch', name: 'Lunch at Enni Udon', type: 'food', tags: ['Vegetarian options'] },
            { time: 'Afternoon', name: 'Stroll along the Champs-Élysées', type: 'activity', tags: ['Paris classic'] },
            { time: 'Late afternoon', name: 'Explore and shop in Le Marais', type: 'shopping', tags: ['Weekend wandering'] },
            { time: 'Tea time', name: "Tea at Les Trois Chocolats or Brigat'", type: 'food', tags: ['Sweet stop', 'Marais'] },
            { time: 'Evening', name: 'Dinner options in Le Marais', type: 'food', tags: ['French / vegetarian', 'Marais'] },
        ],
    },
    {
        id: 'day-6',
        title: 'Day 6',
        date: '20 Apr · Mon · 4 guests',
        locations: [
            { time: 'Morning', name: 'Check out and store luggage before sightseeing', type: 'activity', tags: ['Luggage storage', 'Near Notre-Dame'] },
            { time: 'Morning', name: 'Last-minute souvenir shopping in Saint-Germain', type: 'shopping', tags: ['Final Paris moment'] },
            { time: '1:00pm', name: 'Departure by Eurostar or onward flight', type: 'flight', tags: ['Departure', '4 guests'] },
        ],
    },
];

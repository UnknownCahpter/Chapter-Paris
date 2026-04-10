import { motion } from 'framer-motion';
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import DiningCard from './DiningCard';
import DiningSkeletonCard from './DiningSkeletonCard';
import './DiningSection.css';
import { useRestaurants } from '../hooks/useRestaurants';
import { tripConfig } from '../config/tripConfig';
import type { Venue } from '../config/trip.types';
import { fetchPlacePhotos } from '../services/placesService';

// Render 6 skeleton cards while Firestore data loads
const SKELETON_COUNT = 6;
type DiningSubTab = 'restaurant' | 'cafe' | 'grocery';

const SUB_TABS: { key: DiningSubTab; label: string }[] = [
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'cafe', label: 'Cafes & Pastry' },
  { key: 'grocery', label: 'Gourmet Grocery' },
];

const DINING_GUIDES: Record<
  DiningSubTab,
  {
    eyebrow: string;
    title: string;
    note: string;
    sections: {
      heading: string;
      items: { name: string; detail: string }[];
    }[];
  }
> = {
  restaurant: {
    eyebrow: "Paris Food Guide",
    title: "Restaurant Tips",
    note: "Parisian dining rewards those who know the etiquette.",
    sections: [
      {
        heading: "Must Try",
        items: [
          { name: 'Steak Frites', detail: 'The Parisian classic \u2014 simple, satisfying, everywhere.' },
          { name: 'Confit de Canard', detail: 'Slow-cooked duck leg, crispy skin, melt-in-mouth.' },
          { name: 'Soupe \u00E0 l\u2019Oignon', detail: 'French onion soup with gruy\u00E8re crouton. Perfect on cool evenings.' },
        ],
      },
      {
        heading: "Keywords",
        items: [
          { name: 'Formule / Menu', detail: 'Set lunch menu \u2014 best value, usually 2\u20133 courses.' },
          { name: 'Plat du Jour', detail: 'Daily special \u2014 freshest ingredients, chef\u2019s choice.' },
          { name: 'Fait Maison', detail: 'Homemade \u2014 look for this label on menus.' },
        ],
      },
      {
        heading: "Tips",
        items: [
          { name: 'Service Compris', detail: 'Service is included in the bill. No tip required.' },
          { name: 'Bread is Free', detail: 'Bread basket is complimentary and refillable.' },
          { name: 'Tap Water', detail: 'Ask for "une carafe d\u2019eau" \u2014 free tap water.' },
        ],
      },
    ],
  },
  cafe: {
    eyebrow: "P\u00E2tisserie & Caf\u00E9s",
    title: "Cafe & Pastry Guide",
    note: "Paris patisserie is an art form. Also includes specialty coffee and gourmet shops.",
    sections: [
      {
        heading: "Must Try",
        items: [
          { name: 'Croissant au Beurre', detail: 'The gold standard. Flaky, buttery, perfect.' },
          { name: 'Pain au Chocolat', detail: 'Chocolate-filled pastry. Best warm from the oven.' },
          { name: 'Paris-Brest', detail: 'Choux pastry ring with praline cream. Iconic.' },
          { name: '\u00C9clair', detail: 'Choux pastry with cream filling and glaze. A Parisian invention.' },
        ],
      },
      {
        heading: "Keywords",
        items: [
          { name: 'Viennoiserie', detail: 'Pastries (croissant, pain au chocolat, brioche).' },
          { name: 'P\u00E2tisserie', detail: 'Fine pastries and cakes \u2014 the artistic ones.' },
          { name: 'Formule Petit-D\u00E9jeuner', detail: 'Breakfast set \u2014 coffee + pastry combo deal.' },
        ],
      },
      {
        heading: "Tips",
        items: [
          { name: 'Coffee = Espresso', detail: 'Default coffee is espresso. Ask "un allong\u00E9" for Americano.' },
          { name: 'Terrace Premium', detail: 'Terrace seating may cost more than indoor. Check the menu.' },
        ],
      },
    ],
  },
  grocery: {
    eyebrow: "Gourmet Shopping",
    title: "Grocery Guide",
    note: "Paris gourmet shops are world-class. Bring an extra suitcase.",
    sections: [
      {
        heading: "Must Try",
        items: [
          { name: 'Fromage (Cheese)', detail: 'Ask to taste before buying. Vacuum-sealed options available for travel.' },
          { name: 'Confiture (Jam)', detail: 'Artisanal fruit preserves — Bonne Maman is just the beginning.' },
          { name: 'Chocolat Artisanal', detail: 'Single-origin bars and bonbons from master chocolatiers.' },
        ],
      },
      {
        heading: "Keywords",
        items: [
          { name: 'AOC / AOP', detail: 'Quality label — guaranteed origin and traditional production.' },
          { name: 'Terroir', detail: 'Regional produce — the land and climate that shaped it.' },
          { name: 'Bio', detail: 'Organic certified. Widely available in Paris gourmet shops.' },
        ],
      },
      {
        heading: "Tips",
        items: [
          { name: 'Morning Visits', detail: 'Best stock and freshest selection early in the day.' },
          { name: 'Vacuum Sealing', detail: 'Ask for vacuum-sealed packaging for cheese and charcuterie.' },
        ],
      },
    ],
  },
};

const normaliseDiningName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const buildGoogleMapsSearchUrl = (name: string, address?: string) => {
  const query = address ? `${name} ${address}` : name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const ARRONDISSEMENT_LABELS: Record<string, string> = {
  '75001': '1er (Louvre)',
  '75002': '2e (Bourse)',
  '75003': '3e (Le Marais)',
  '75004': '4e (Le Marais)',
  '75005': '5e (Latin Quarter)',
  '75006': '6e (Saint-Germain)',
  '75007': '7e (Eiffel Tower)',
  '75008': '8e (Champs-Élysées)',
  '75009': '9e (Opera)',
  '75010': '10e (Canal St-Martin)',
  '75011': '11e (Bastille)',
  '75012': '12e (Bercy)',
  '75016': '16e (Trocadero)',
  '75018': '18e (Montmartre)',
};

const extractArrondissement = (address?: string): string | null => {
  if (!address) return null;
  const match = address.match(/750\d{2}/);
  if (!match) return null;
  return ARRONDISSEMENT_LABELS[match[0]] ?? null;
};

const CATEGORY_TRANSLATIONS: Array<[string, string]> = [
  ['brunch restaurant', 'Brunch Restaurant'],
  ['coffee shop', 'Coffee Shop'],
  ['pastry shop', 'Pastry Shop'],
  ['bakery', 'Bakery'],
  ['food store', 'Food Store'],
  ['french restaurant', 'French Restaurant'],
  ['mediterranean restaurant', 'Mediterranean Restaurant'],
  ['bistro', 'Bistro'],
  ['cocktail bar', 'Cocktail Bar'],
  ['lounge bar', 'Lounge Bar'],
  ['wine bar', 'Wine Bar'],
  ['karaoke', 'Karaoke'],
  ['italian restaurant', 'Italian Restaurant'],
  ['family restaurant', 'Family Restaurant'],
  ['ice cream shop', 'Ice Cream Shop'],
  ['dessert shop', 'Dessert Shop'],
  ['tea house', 'Tea House'],
  ['sandwich shop', 'Sandwich Shop'],
  ['catering service', 'Catering Service'],
  ['seafood restaurant', 'Seafood Restaurant'],
  ['pizza restaurant', 'Pizza Restaurant'],
  ['hamburger restaurant', 'Hamburger Restaurant'],
  ['american restaurant', 'American Restaurant'],
  ['confectionery', 'Confectionery'],
  ['fine dining restaurant', 'Fine Dining Restaurant'],
  ['coffee stand', 'Coffee Stand'],
  ['coffee roastery', 'Coffee Roastery'],
  ['liquor store', 'Liquor Store'],
];

const FALLBACK_VENUE_IMAGES: Record<DiningSubTab, string[]> = {
  restaurant: [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=675&fit=crop',
  ],
  cafe: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=675&fit=crop',
  ],
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=675&fit=crop',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=1200&h=675&fit=crop',
  ],
};

const translateVenueCategory = (value?: string) => {
  if (!value || value === 'N/A') return 'Featured';

  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      const translated = CATEGORY_TRANSLATIONS.find(([english]) => english === lower);
      return translated?.[1] ?? part;
    })
    .join(', ');
};

const getFallbackImagesForVenue = (venue: Venue) => {
  if (venue.tab === 'cafe' || venue.tab === 'grocery') return FALLBACK_VENUE_IMAGES[venue.tab];
  return FALLBACK_VENUE_IMAGES.restaurant;
};

const findMatchingRestaurantVenue = (venues: Venue[], restaurantName: string, city: string) => {
  const normalizedRestaurantName = normaliseDiningName(restaurantName);
  return venues.find((venue) => {
    if (venue.city !== city || venue.tab !== 'restaurant') return false;
    const normalizedVenueName = normaliseDiningName(venue.name);
    return normalizedVenueName === normalizedRestaurantName
      || normalizedVenueName.includes(normalizedRestaurantName)
      || normalizedRestaurantName.includes(normalizedVenueName);
  });
};

const hasMatchingRestaurant = (restaurants: { name: string; city: string }[], venue: Venue) => {
  const normalizedVenueName = normaliseDiningName(venue.name);
  return restaurants.some((restaurant) => {
    if (restaurant.city !== venue.city) return false;
    const normalizedRestaurantName = normaliseDiningName(restaurant.name);
    return normalizedVenueName === normalizedRestaurantName
      || normalizedVenueName.includes(normalizedRestaurantName)
      || normalizedRestaurantName.includes(normalizedVenueName);
  });
};

const toggleFilter = (
  current: string[],
  setter: Dispatch<SetStateAction<string[]>>,
  value: string,
) => {
  setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
};

const VenueCard = ({
  venue,
  images,
  showReservation,
}: {
  venue: Venue;
  images: string[];
  showReservation: boolean;
}) => (
  <article className="dining-card dining-venue-card">
    {venue.isMarcosPick ? (
      <div className="dining-card-badge">Marco's Pick</div>
    ) : null}
    <div className="dining-venue-media">
      {images[0] ? <img src={images[0]} alt={venue.name} loading="lazy" /> : null}
    </div>
    <div className="dining-card-body dining-venue-body">
      <div className="dining-venue-header">
        <div>
          <div className="dining-card-cuisine dining-venue-category">{translateVenueCategory(venue.category)}</div>
          <h3 className="dining-card-name dining-venue-name">{venue.name}</h3>
        </div>
      </div>

      {venue.googleRating != null ? (
        <div className="dining-card-rating dining-venue-rating">
          <span className="dining-card-star">☆</span>
          <span>{venue.googleRating.toFixed(1)}</span>
          {venue.reviewCount != null ? <span>({venue.reviewCount.toLocaleString()})</span> : null}
        </div>
      ) : null}

      {venue.address ? (
        <div className="dining-card-meta dining-venue-meta">
          <span>📍 {venue.address}</span>
        </div>
      ) : null}
      {venue.remark ? <p className="dining-venue-remark">{venue.remark}</p> : null}

      {(venue.googleMapsUrl || venue.reservationUrl) ? (
        <div className="dining-card-footer dining-venue-actions">
          {venue.googleMapsUrl ? (
            <a href={venue.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="dining-card-button dining-card-button-secondary">
              <MapPin size={14} />
              <span>Map</span>
            </a>
          ) : null}
          {showReservation && venue.reservationUrl ? (
            <a href={venue.reservationUrl} target="_blank" rel="noopener noreferrer" className="dining-card-button">
              <ExternalLink size={14} />
              <span>Reserve</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  </article>
);

const DiningSection = () => {
  const city = tripConfig.venues?.find((v) => v.city)?.city ?? '';
  const { restaurants, loading, error } = useRestaurants(city);
  const [activeSubTab, setActiveSubTab] = useState<DiningSubTab>('restaurant');
  const [photoOverrides, setPhotoOverrides] = useState<Record<string, string[]>>({});
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const venues = tripConfig.venues ?? [];
  const allRestaurants = restaurants;
  const hasLiveRestaurants = restaurants.length > 0;
  const [activeCuisineFilters, setActiveCuisineFilters] = useState<string[]>([]);
  const [activeAreaFilters, setActiveAreaFilters] = useState<string[]>([]);

  useEffect(() => {
    setActiveCuisineFilters([]);
    setActiveAreaFilters([]);
  }, [activeSubTab]);

  const cuisineOptions = useMemo(() => {
    const tags = new Set<string>();
    venues
      .filter((venue) => venue.tab === activeSubTab)
      .forEach((venue) => {
        venue.category
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .forEach((tag) => tags.add(tag));
      });
    return [...tags].sort((a, b) => a.localeCompare(b));
  }, [activeSubTab, venues]);

  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    venues
      .filter((venue) => venue.tab === activeSubTab)
      .forEach((venue) => {
        const area = extractArrondissement(venue.address);
        if (area) areas.add(area);
      });
    return [...areas].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [activeSubTab, venues]);
  const hasActiveFilters = activeCuisineFilters.length > 0 || activeAreaFilters.length > 0;
  const activeFilterCount = activeCuisineFilters.length + activeAreaFilters.length;

  const filteredVenues = useMemo(
    () => venues.filter((venue) => {
      if (venue.tab !== activeSubTab) return false;
      if (activeSubTab !== 'restaurant' && hasMatchingRestaurant(allRestaurants, venue)) return false;

      if (activeCuisineFilters.length > 0) {
        const venueCuisines = venue.category.split(',').map((value) => value.trim()).filter(Boolean);
        if (!activeCuisineFilters.some((filterValue) => venueCuisines.includes(filterValue))) return false;
      }

      if (activeAreaFilters.length > 0) {
        const venueArea = extractArrondissement(venue.address);
        if (!venueArea || !activeAreaFilters.includes(venueArea)) return false;
      }

      return true;
    }),
    [activeAreaFilters, activeCuisineFilters, activeSubTab, allRestaurants, venues],
  );
  const cityOrder = useMemo(() => {
    const orderedCities: string[] = [];
    if (activeSubTab === 'restaurant' && hasLiveRestaurants) {
      for (const restaurant of restaurants) {
        if (!orderedCities.includes(restaurant.city)) {
          orderedCities.push(restaurant.city);
        }
      }
      return orderedCities;
    }

    for (const venue of filteredVenues) {
      if (!orderedCities.includes(venue.city)) {
        orderedCities.push(venue.city);
      }
    }
    return orderedCities;
  }, [activeSubTab, filteredVenues, hasLiveRestaurants, restaurants]);
  const [activeCity, setActiveCity] = useState('');

  useEffect(() => {
    if (cityOrder.length === 0) return;
    if (!cityOrder.includes(activeCity)) {
      setActiveCity(cityOrder[0]);
    }
  }, [activeCity, cityOrder]);

  const visibleRestaurants = activeCity
    ? restaurants.filter((restaurant) => restaurant.city === activeCity)
    : restaurants;
  const visibleVenues = activeCity
    ? filteredVenues.filter((venue) => venue.city === activeCity)
    : filteredVenues;
  const displayRestaurants = useMemo(
    () => visibleRestaurants.map((restaurant) => {
      const matchedVenue = findMatchingRestaurantVenue(venues, restaurant.name, restaurant.city);
      const googleMapsUrl = matchedVenue?.googleMapsUrl
        ?? restaurant.googleMapsUrl
        ?? buildGoogleMapsSearchUrl(restaurant.name, matchedVenue?.address ?? restaurant.address);
      const reservationUrl = matchedVenue?.reservationUrl ?? googleMapsUrl;

      return {
        ...restaurant,
        cuisine: matchedVenue?.category ?? restaurant.cuisine,
        address: matchedVenue?.address ?? restaurant.address,
        googleMapsUrl,
        reservationUrl,
        remark: matchedVenue?.remark,
        isMarcosPick: matchedVenue?.isMarcosPick ?? false,
        images: matchedVenue?.photoUrls ?? photoOverrides[`restaurant:${restaurant.id}`] ?? restaurant.images,
      };
    }).filter((restaurant) => {
      if (activeCuisineFilters.length > 0) {
        const restaurantCuisines = restaurant.cuisine.split(',').map((value) => value.trim()).filter(Boolean);
        if (!activeCuisineFilters.some((filterValue) => restaurantCuisines.includes(filterValue))) return false;
      }

      if (activeAreaFilters.length > 0) {
        const restaurantArea = extractArrondissement(restaurant.address);
        if (!restaurantArea || !activeAreaFilters.includes(restaurantArea)) return false;
      }

      return true;
    }).sort((a, b) => Number(b.isMarcosPick ?? false) - Number(a.isMarcosPick ?? false)),
    [activeAreaFilters, activeCuisineFilters, photoOverrides, venues, visibleRestaurants],
  );
  const displayVenues = useMemo(
    () => [...visibleVenues].sort((a, b) => Number(b.isMarcosPick) - Number(a.isMarcosPick)),
    [visibleVenues],
  );
  const venueImages = useMemo(
    () => Object.fromEntries(
      displayVenues.map((venue) => [
        `${venue.city}:${venue.name}`,
        photoOverrides[`venue:${venue.city}:${venue.name}`] ?? venue.photoUrls ?? getFallbackImagesForVenue(venue),
      ]),
    ),
    [displayVenues, photoOverrides],
  );

  useEffect(() => {
    const targets = visibleRestaurants
      .map((restaurant) => ({
        restaurant,
        matchedVenue: findMatchingRestaurantVenue(venues, restaurant.name, restaurant.city),
      }))
      .filter(({ restaurant }) => !photoOverrides[`restaurant:${restaurant.id}`]);

    if (targets.length === 0) return;

    let cancelled = false;
    targets.forEach(({ restaurant, matchedVenue }) => {
      fetchPlacePhotos({
        name: restaurant.name,
        city: restaurant.city,
        address: matchedVenue?.photoAddress ?? matchedVenue?.address ?? restaurant.address,
        query: matchedVenue?.photoSearchText,
      }).then((images) => {
        if (cancelled || images.length === 0) return;
        setPhotoOverrides((current) => current[`restaurant:${restaurant.id}`]
          ? current
          : { ...current, [`restaurant:${restaurant.id}`]: images });
      }).catch((error) => {
        console.error('[DiningSection] restaurant photo fetch failed', {
          restaurant: restaurant.name,
          city: restaurant.city,
          error,
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [photoOverrides, visibleRestaurants]);

  useEffect(() => {
    const shouldFetchVenuePhotos = activeSubTab !== 'restaurant' || displayRestaurants.length === 0;
    if (!shouldFetchVenuePhotos) return;

    const targets = displayVenues.filter(
      (venue) => !venue.photoUrls?.length && !photoOverrides[`venue:${venue.city}:${venue.name}`],
    );
    if (targets.length === 0) return;

    let cancelled = false;
    targets.forEach((venue) => {
      fetchPlacePhotos({
        name: venue.name,
        city: venue.city,
        address: venue.photoAddress ?? venue.address,
        query: venue.photoSearchText,
      }).then((images) => {
        if (cancelled || images.length === 0) return;
        setPhotoOverrides((current) => current[`venue:${venue.city}:${venue.name}`]
          ? current
          : { ...current, [`venue:${venue.city}:${venue.name}`]: images });
      }).catch((error) => {
        console.error('[DiningSection] venue photo fetch failed', {
          venue: venue.name,
          city: venue.city,
          error,
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [activeSubTab, displayRestaurants.length, displayVenues, photoOverrides]);

  return (
    <section className="dining-section">
      <header className="dining-section-header">
        <h2 className="dining-section-title">Dining Recommendations</h2>
        <p className="dining-section-subtitle">Paris restaurants, cafés, and bars worth your time</p>
        {error ? (
          <p style={{ color: 'var(--color-ink-light)', fontSize: '0.9rem', margin: 0 }}>
            Live restaurant feed unavailable right now. Showing saved Paris picks instead.
          </p>
        ) : null}
      </header>

      <div className="dining-subtabs" aria-label="Dining categories">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`dining-subtab ${activeSubTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeSubTab === 'restaurant' || activeSubTab === 'cafe') && (cuisineOptions.length > 0 || areaOptions.length > 0) && (
        <div className="dining-filter-bar">
          <div className="dining-filter-topline">
            <div className="dining-filter-summary">
              <span className="dining-filter-title">Refine Picks</span>
              <span className="dining-filter-status">
                {hasActiveFilters ? `${activeFilterCount} selected` : 'Optional filters'}
              </span>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                className="dining-filter-clear"
                onClick={() => {
                  setActiveCuisineFilters([]);
                  setActiveAreaFilters([]);
                }}
              >
                Clear all
              </button>
            ) : null}
          </div>

          {cuisineOptions.length > 0 && (
            <div className="dining-filter-row">
              <span className="dining-filter-label">Cuisine</span>
              <div className="dining-filter-pills">
                <button
                  type="button"
                  className={`dining-filter-pill ${activeCuisineFilters.length === 0 ? 'active' : ''}`}
                  onClick={() => setActiveCuisineFilters([])}
                >
                  All
                </button>
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    className={`dining-filter-pill ${activeCuisineFilters.includes(cuisine) ? 'active' : ''}`}
                    onClick={() => toggleFilter(activeCuisineFilters, setActiveCuisineFilters, cuisine)}
                  >
                    {translateVenueCategory(cuisine)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {areaOptions.length > 0 && (
            <div className="dining-filter-row">
              <span className="dining-filter-label">Area</span>
              <div className="dining-filter-pills">
                <button
                  type="button"
                  className={`dining-filter-pill ${activeAreaFilters.length === 0 ? 'active' : ''}`}
                  onClick={() => setActiveAreaFilters([])}
                >
                  All
                </button>
                {areaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    className={`dining-filter-pill ${activeAreaFilters.includes(area) ? 'active' : ''}`}
                    onClick={() => toggleFilter(activeAreaFilters, setActiveAreaFilters, area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <section className="dining-guide-card" aria-label="Local dining guide">
        <button
          type="button"
          className="dining-guide-toggle"
          onClick={() => setIsGuideOpen((current) => !current)}
          aria-expanded={isGuideOpen}
        >
          <div className="dining-guide-header">
            <span className="dining-guide-eyebrow">{DINING_GUIDES[activeSubTab].eyebrow}</span>
            <h3 className="dining-guide-title">{DINING_GUIDES[activeSubTab].title}</h3>
            <p className="dining-guide-note">{DINING_GUIDES[activeSubTab].note}</p>
          </div>
          <span className="dining-guide-toggle-label">{isGuideOpen ? 'Collapse' : 'Expand'}</span>
        </button>
        {isGuideOpen ? (
          <div className="dining-guide-grid">
            {DINING_GUIDES[activeSubTab].sections.map((section) => (
              <article key={section.heading} className="dining-guide-item">
                <h4 className="dining-guide-section-title">{section.heading}</h4>
                <div className="dining-guide-list">
                  {section.items.map((item) => (
                    <div key={item.name} className="dining-guide-list-item">
                      <h5 className="dining-guide-item-title">{item.name}</h5>
                      <p className="dining-guide-item-detail">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {!loading && cityOrder.length > 1 && (
        <div className="dining-city-tabs" aria-label="Dining cities">
          {cityOrder.map((city) => (
            <button
              key={city}
              type="button"
              className={`dining-city-tab ${activeCity === city ? 'active' : ''}`}
              onClick={() => setActiveCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      <div className="dining-section-grid">
        {activeSubTab === 'restaurant' && loading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <DiningSkeletonCard key={i} />
            ))
          : activeSubTab === 'restaurant' && displayRestaurants.length > 0
            ? displayRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: index * 0.06 }}
              >
                <DiningCard restaurant={restaurant} />
              </motion.div>
              ))
            : displayVenues.map((venue, index) => (
              <motion.div
                key={`${venue.city}-${venue.name}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: index * 0.06 }}
              >
                <VenueCard
                  venue={venue}
                  images={venueImages[`${venue.city}:${venue.name}`] ?? []}
                  showReservation={activeSubTab === 'restaurant'}
                />
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default DiningSection;

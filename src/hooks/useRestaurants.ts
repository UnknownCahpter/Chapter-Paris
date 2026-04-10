import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { fetchAndCachePhotos } from '../services/placesService';

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  pricePerPerson: number;
  images: string[];
  googleMapsUrl?: string;
  address?: string;
  reservationUrl?: string;
  remark?: string;
  isMarcosPick?: boolean;
}

const fallbackRestaurants: Restaurant[] = [];

// Generic Unsplash fallback used while real photos are being fetched
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop',
];

// Firestore document shape — images are optional until fetched
interface RestaurantDoc {
  id: string;
  name: string;
  city?: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  pricePerPerson: number;
  images?: string[];
  remark?: string;
}

const fallbackRestaurantById = new Map(
  fallbackRestaurants.map((restaurant) => [restaurant.id, restaurant]),
);

const normaliseRestaurantName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const fallbackRestaurantByName = new Map(
  fallbackRestaurants.map((restaurant) => [
    normaliseRestaurantName(restaurant.name),
    restaurant,
  ]),
);

// Runs `fn` over `items` with at most `concurrency` promises in-flight at once
async function runThrottled<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  async function next(): Promise<void> {
    if (index >= items.length) return;
    const item = items[index++];
    await fn(item);
    return next();
  }
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    next,
  );
  await Promise.all(workers);
}

export function useRestaurants(city: string): {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
} {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tracks IDs that already have an in-flight or completed fetch
  const pendingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!firestore) {
      setError('Firebase not configured');
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(firestore, 'restaurants'), where('city', '==', city)),
      (snapshot) => {
        const docs: RestaurantDoc[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<RestaurantDoc, 'id'>),
        }));

        // Map to Restaurant[] — use cached images or fallback
        const mapped: Restaurant[] = docs.map((doc) => {
          const fallbackRestaurant = fallbackRestaurantById.get(doc.id)
            ?? fallbackRestaurantByName.get(normaliseRestaurantName(doc.name));

          const rawRemark = doc.remark ?? fallbackRestaurant?.remark;
          const remark = rawRemark
            ? rawRemark.replace('馬高重點推介*', '').trim() || undefined
            : undefined;

          return {
            id: doc.id,
            name: fallbackRestaurant?.name ?? doc.name,
            city: doc.city ?? fallbackRestaurant?.city ?? '',
            cuisine: fallbackRestaurant?.cuisine ?? doc.cuisine,
            rating: doc.rating ?? fallbackRestaurant?.rating ?? 0,
            reviewCount: doc.reviewCount ?? fallbackRestaurant?.reviewCount ?? 0,
            distanceKm: doc.distanceKm ?? fallbackRestaurant?.distanceKm ?? 0,
            pricePerPerson: doc.pricePerPerson ?? fallbackRestaurant?.pricePerPerson ?? 0,
            images: doc.images?.length
              ? doc.images
              : fallbackRestaurant?.images ?? FALLBACK_IMAGES,
            remark,
          };
        });

        setRestaurants(mapped);
        setLoading(false);

        // Trigger photo fetches for docs that have no images and aren't already pending
        const needsPhotos = docs.filter(
          (doc) => !doc.images?.length && !pendingIds.current.has(doc.id),
        );

        needsPhotos.forEach((doc) => pendingIds.current.add(doc.id));

        // Fire-and-forget — onSnapshot handles the UI update when Firestore writes complete
        runThrottled(needsPhotos, 3, async (doc) => {
          try {
            await fetchAndCachePhotos(doc.id, {
              name: doc.name,
              city: doc.city,
            });
          } catch (err) {
            console.warn(`Failed to fetch photos for "${doc.name}":`, err);
            // Remove from pending so it can retry on next snapshot
            pendingIds.current.delete(doc.id);
          }
        });
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { restaurants, loading, error };
}

import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { tripConfig } from '../config/tripConfig';

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string;
const PHOTO_CACHE_PREFIX = 'places_photo_cache:';

interface PlacePhotoRequest {
  name: string;
  city?: string;
  address?: string;
  query?: string;
}

// Default location bias — sourced from the active trip config (50 km radius)
const LOCATION_BIAS = {
  circle: {
    center: {
      latitude: tripConfig.coordinates.latitude,
      longitude: tripConfig.coordinates.longitude,
    },
    radius: 50000,
  },
};

const buildSearchText = ({ name, city, address, query }: PlacePhotoRequest) => {
  if (query) return query;
  return [name, address, city, 'France'].filter(Boolean).join(' ');
};

async function searchPlace(
  request: PlacePhotoRequest,
): Promise<{ placeId: string; photoNames: string[] } | null> {
  const query = buildSearchText(request);

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.photos',
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1,
        locationBias: LOCATION_BIAS,
      }),
    });

    if (!res.ok) {
      console.error('[placesService] Places API search error', {
        restaurantName: request.name,
        query,
        status: res.status,
        statusText: res.statusText,
      });
      return null;
    }

    const data = (await res.json()) as { places?: { id: string; photos?: { name: string }[] }[] };

    const place = data.places?.[0];
    if (!place) return null;

    return {
      placeId: place.id,
      photoNames: (place.photos ?? []).slice(0, 3).map((p) => p.name),
    };
  } catch (error) {
    console.error('[placesService] Places API search exception', {
      restaurantName: request.name,
      query,
      error,
    });
    return null;
  }
}

const getCacheKey = ({ name, city, address, query }: PlacePhotoRequest) =>
  `${PHOTO_CACHE_PREFIX}${`${query ?? ''}__${name}__${address ?? ''}__${city ?? ''}`.toLowerCase()}`;

const readCachedPhotos = (request: PlacePhotoRequest): string[] | null => {
  try {
    const raw = localStorage.getItem(getCacheKey(request));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { images?: string[] };
    return parsed.images?.length ? parsed.images : null;
  } catch {
    return null;
  }
};

const writeCachedPhotos = (request: PlacePhotoRequest, images: string[]) => {
  try {
    localStorage.setItem(getCacheKey(request), JSON.stringify({ images }));
  } catch {
    // Ignore storage quota / privacy mode failures.
  }
};

export async function fetchPlacePhotos(
  request: PlacePhotoRequest,
): Promise<string[]> {
  if (!PLACES_API_KEY) return [];

  const cached = readCachedPhotos(request);
  if (cached) return cached;

  const result = await searchPlace(request);
  if (!result || !result.photoNames.length) return [];

  const images = (
    await Promise.allSettled(result.photoNames.map(resolvePhotoUrl))
  )
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map((r) => r.value);

  if (images.length) {
    writeCachedPhotos(request, images);
  }

  return images;
}

async function resolvePhotoUrl(photoName: string): Promise<string> {
  const res = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${PLACES_API_KEY}`,
  );
  if (!res.ok) throw new Error(`Photo fetch failed (${res.status})`);
  const data = (await res.json()) as { photoUri: string };
  return data.photoUri;
}

/**
 * Searches the Places API for the restaurant by name, resolves up to 3 photo
 * URLs, then writes { place_id, images } back to the Firestore cache.
 * No-ops silently if Firebase or the API key is not configured.
 */
export async function fetchAndCachePhotos(
  restaurantId: string,
  request: PlacePhotoRequest,
): Promise<void> {
  if (!firestore || !PLACES_API_KEY) return;

  const images = await fetchPlacePhotos(request);
  if (!images.length) return;

  const result = await searchPlace(request);
  if (!result) return;

  await setDoc(
    doc(firestore, 'restaurants', restaurantId),
    { place_id: result.placeId, images },
    { merge: true },
  );
}

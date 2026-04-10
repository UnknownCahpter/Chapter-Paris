import { useEffect, useMemo, useState } from 'react';
import type { Restaurant } from '../hooks/useRestaurants';
import './DiningCard.css';

interface DiningCardProps {
  restaurant: Restaurant;
}

const AUTO_ADVANCE_MS = 4000;

const DiningCard = ({ restaurant }: DiningCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imageCount = restaurant.images.length;

  useEffect(() => {
    if (isPaused || imageCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageCount);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [imageCount, isPaused]);

  const ratingLabel = useMemo(
    () => `${restaurant.rating.toFixed(1)} (${restaurant.reviewCount.toLocaleString()})`,
    [restaurant.rating, restaurant.reviewCount],
  );

  return (
    <article
      className="dining-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {restaurant.isMarcosPick ? (
        <div className="dining-card-badge">Marco's Pick</div>
      ) : null}
      <div className="dining-card-media">
        <div
          className="dining-card-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {restaurant.images.map((image, index) => (
            <div className="dining-card-slide" key={`${restaurant.id}-${index}`}>
              <img src={image} alt={`${restaurant.name} ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="dining-card-dots" aria-label={`${restaurant.name} photo gallery`}>
          {restaurant.images.map((_, index) => (
            <button
              key={`${restaurant.id}-dot-${index}`}
              type="button"
              className={`dining-card-dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="dining-card-body">
        <div className="dining-card-cuisine">{restaurant.cuisine}</div>
        <h3 className="dining-card-name">{restaurant.name}</h3>

        <div className="dining-card-rating" aria-label={`Rating: ${ratingLabel}`}>
          <span className="dining-card-star">☆</span>
          <span>{restaurant.rating.toFixed(1)}</span>
          <span>({restaurant.reviewCount.toLocaleString()})</span>
        </div>

        <div className="dining-card-meta">
          <span>📍 {restaurant.distanceKm.toFixed(1)} km from centre</span>
          <span>€{restaurant.pricePerPerson} / person</span>
        </div>

        {restaurant.remark ? (
          <p className="dining-card-remark">
            {restaurant.remark}
          </p>
        ) : null}

        <div className="dining-card-footer">
          {restaurant.googleMapsUrl ? (
            <a
              href={restaurant.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dining-card-button"
            >
              Map
            </a>
          ) : null}
          {restaurant.reservationUrl ? (
            <a
              href={restaurant.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dining-card-button dining-card-button-secondary"
            >
              Reserve
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default DiningCard;

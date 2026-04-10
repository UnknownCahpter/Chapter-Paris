import './DiningSkeletonCard.css';

const DiningSkeletonCard = () => (
  <article className="skeleton-card" aria-hidden="true">
    <div className="skeleton-media" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line-sm" />
      <div className="skeleton-line skeleton-line-md" />
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line skeleton-line-btn" />
    </div>
  </article>
);

export default DiningSkeletonCard;

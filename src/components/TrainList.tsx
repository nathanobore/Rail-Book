import { ChevronLeft, Brain as TrainIcon, AlertCircle } from 'lucide-react';
import { Train, SearchParams } from '../types';
import TrainCard from './TrainCard';

interface TrainListProps {
  trains: Train[];
  searchParams: SearchParams;
  onSelect: (train: Train) => void;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TrainList({ trains, searchParams, onSelect, onBack }: TrainListProps) {
  return (
    <section className="trains-section">
      <div className="section-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Search
        </button>

        <div className="route-summary">
          <div className="route-summary-main">
            <span className="route-city-lg">{searchParams.from_city}</span>
            <span className="route-sep">→</span>
            <span className="route-city-lg">{searchParams.to_city}</span>
          </div>
          <div className="route-summary-sub">
            {formatDate(searchParams.date)} &bull; {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
          </div>
        </div>

        <div className="results-count">
          {trains.length} train{trains.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {trains.length === 0 ? (
        <div className="no-trains">
          <div className="no-trains-icon">
            <AlertCircle size={40} />
          </div>
          <h3>No trains found</h3>
          <p>We couldn't find any trains between {searchParams.from_city} and {searchParams.to_city}.</p>
          <p>Try searching for different cities or dates.</p>
          <button className="back-btn-lg" onClick={onBack}>Search Again</button>
        </div>
      ) : (
        <div className="trains-grid">
          {trains.map(train => (
            <TrainCard
              key={train.id}
              train={train}
              passengers={searchParams.passengers}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      <div className="trains-footer">
        <TrainIcon size={16} />
        <span>All times shown in local time. Prices per passenger.</span>
      </div>
    </section>
  );
}

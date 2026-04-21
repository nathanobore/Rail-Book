import { Clock, Users, IndianRupee, ArrowRight, Zap } from 'lucide-react';
import { Train } from '../types';

interface TrainCardProps {
  train: Train;
  passengers: number;
  onSelect: (train: Train) => void;
}

function calcDuration(dep: string, arr: string): string {
  const [dh, dm] = dep.split(':').map(Number);
  const [ah, am] = arr.split(':').map(Number);
  let depMins = dh * 60 + dm;
  let arrMins = ah * 60 + am;
  if (arrMins <= depMins) arrMins += 24 * 60;
  const diff = arrMins - depMins;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

const CLASS_COLORS = [
  'card-accent-blue',
  'card-accent-teal',
  'card-accent-amber',
  'card-accent-rose',
  'card-accent-green',
];

export default function TrainCard({ train, passengers, onSelect }: TrainCardProps) {
  const duration = calcDuration(train.departure, train.arrival);
  const total = (train.price * passengers).toFixed(2);
  const isLowSeats = train.seats < 30;
  const colorClass = CLASS_COLORS[train.name.charCodeAt(0) % CLASS_COLORS.length];

  return (
    <div className={`train-card ${colorClass}`}>
      <div className="train-card-top">
        <div className="train-name-row">
          <div className="train-name-badge">
            <Zap size={14} />
            <span>{train.name}</span>
          </div>
          {isLowSeats && (
            <span className="low-seats-badge">Only {train.seats} left!</span>
          )}
        </div>

        <div className="train-route">
          <div className="route-point">
            <span className="route-city">{train.from_city}</span>
            <span className="route-time">{formatTime(train.departure)}</span>
          </div>

          <div className="route-line">
            <div className="route-line-track">
              <div className="route-line-dot"></div>
              <div className="route-line-bar"></div>
              <div className="route-duration">{duration}</div>
              <div className="route-line-bar"></div>
              <div className="route-line-dot"></div>
            </div>
            <ArrowRight size={16} className="route-arrow" />
          </div>

          <div className="route-point">
            <span className="route-city">{train.to_city}</span>
            <span className="route-time">{formatTime(train.arrival)}</span>
          </div>
        </div>
      </div>

      <div className="train-card-bottom">
        <div className="train-meta">
          <div className="meta-item">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="meta-item">
            <Users size={14} />
            <span>{train.seats} seats available</span>
          </div>
        </div>

        <div className="train-price-row">
          <div className="price-block">
            <div className="price-per">
              <IndianRupee size={13} />
              <span>{train.price.toLocaleString('en-IN')}</span>
              <span className="price-per-label">/ person</span>
            </div>
            {passengers > 1 && (
              <div className="price-total">
                Total: ₹{parseFloat(total).toLocaleString('en-IN')} for {passengers}
              </div>
            )}
          </div>
          <button className="select-btn" onClick={() => onSelect(train)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

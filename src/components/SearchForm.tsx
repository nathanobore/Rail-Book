import { useState } from 'react';
import { MapPin, Calendar, Users, Search, ArrowRight } from 'lucide-react';
import { SearchParams } from '../types';

const CITIES = [
  'Ahmedabad', 'Bangalore', 'Chennai', 'Delhi',
  'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 'Pune',
];

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [params, setParams] = useState<SearchParams>({
    from_city: '',
    to_city: '',
    date: today,
    passengers: 1,
  });
  const [errors, setErrors] = useState<Partial<SearchParams>>({});

  const validate = () => {
    const errs: Partial<SearchParams> = {};
    if (!params.from_city) errs.from_city = 'Select departure city';
    if (!params.to_city) errs.to_city = 'Select destination city';
    if (params.from_city && params.to_city && params.from_city === params.to_city) {
      errs.to_city = 'Destination must differ from departure';
    }
    if (!params.date) errs.date = 'Select travel date';
    if (params.passengers < 1 || params.passengers > 6) errs.passengers = 1;
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSearch(params);
  };

  const swapCities = () => {
    setParams(p => ({ ...p, from_city: p.to_city, to_city: p.from_city }));
  };

  return (
    <section className="search-section">
      <div className="search-hero">
        <h1 className="hero-title">Book Your Train Journey</h1>
        <p className="hero-subtitle">Search from hundreds of routes across the country</p>
      </div>

      <div className="search-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="search-grid">
            <div className="field-group">
              <label className="field-label">
                <MapPin size={15} /> From
              </label>
              <select
                className={`field-input ${errors.from_city ? 'field-error' : ''}`}
                value={params.from_city}
                onChange={e => setParams(p => ({ ...p, from_city: e.target.value }))}
              >
                <option value="">Select city</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.from_city && <span className="error-msg">{errors.from_city}</span>}
            </div>

            <button type="button" className="swap-btn" onClick={swapCities} aria-label="Swap cities">
              <ArrowRight size={18} />
            </button>

            <div className="field-group">
              <label className="field-label">
                <MapPin size={15} /> To
              </label>
              <select
                className={`field-input ${errors.to_city ? 'field-error' : ''}`}
                value={params.to_city}
                onChange={e => setParams(p => ({ ...p, to_city: e.target.value }))}
              >
                <option value="">Select city</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.to_city && <span className="error-msg">{errors.to_city}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">
                <Calendar size={15} /> Travel Date
              </label>
              <input
                type="date"
                className={`field-input ${errors.date ? 'field-error' : ''}`}
                value={params.date}
                min={today}
                onChange={e => setParams(p => ({ ...p, date: e.target.value }))}
              />
              {errors.date && <span className="error-msg">{errors.date}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">
                <Users size={15} /> Passengers
              </label>
              <input
                type="number"
                className="field-input"
                value={params.passengers}
                min={1}
                max={6}
                onChange={e => setParams(p => ({ ...p, passengers: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Searching trains...
              </span>
            ) : (
              <span className="btn-content">
                <Search size={18} /> Search Trains
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

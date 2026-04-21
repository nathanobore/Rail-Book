import { useState } from 'react';
import { ChevronLeft, User, Mail, Phone, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { Train, SearchParams } from '../types';

interface BookingFormProps {
  train: Train;
  searchParams: SearchParams;
  onBook: (details: { passenger_name: string; email: string; phone: string }) => void;
  onBack: () => void;
  loading: boolean;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BookingForm({ train, searchParams, onBook, onBack, loading }: BookingFormProps) {
  const [form, setForm] = useState({ passenger_name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<typeof form>({ passenger_name: '', email: '', phone: '' });

  const total = (train.price * searchParams.passengers).toFixed(2);

  const validate = () => {
    const errs = { passenger_name: '', email: '', phone: '' };
    if (!form.passenger_name.trim() || form.passenger_name.trim().length < 3) {
      errs.passenger_name = 'Enter full name (min 3 characters)';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.phone.trim() || !/^[0-9+\-\s]{10,15}$/.test(form.phone)) {
      errs.phone = 'Enter a valid phone number (10-15 digits)';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.values(errs).some(v => v)) {
      setErrors(errs);
      return;
    }
    setErrors({ passenger_name: '', email: '', phone: '' });
    onBook(form);
  };

  return (
    <section className="booking-section">
      <div className="section-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Trains
        </button>
        <h2 className="section-title">Complete Your Booking</h2>
      </div>

      <div className="booking-layout">
        <div className="booking-form-card">
          <h3 className="form-card-title">
            <User size={18} /> Passenger Details
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="field-label">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                className={`field-input ${errors.passenger_name ? 'field-error' : ''}`}
                placeholder="e.g. Rahul Sharma"
                value={form.passenger_name}
                onChange={e => setForm(f => ({ ...f, passenger_name: e.target.value }))}
              />
              {errors.passenger_name && <span className="error-msg">{errors.passenger_name}</span>}
            </div>

            <div className="form-field">
              <label className="field-label">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                className={`field-input ${errors.email ? 'field-error' : ''}`}
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label className="field-label">
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                className={`field-input ${errors.phone ? 'field-error' : ''}`}
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner spinner-white"></span>
                  Processing Booking...
                </span>
              ) : (
                <span className="btn-content">
                  <CheckCircle size={18} /> Confirm Booking &bull; ₹{parseFloat(total).toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="booking-summary-card">
          <h3 className="form-card-title">Booking Summary</h3>

          <div className="summary-train-name">{train.name}</div>

          <div className="summary-route">
            <div className="summary-point">
              <div className="summary-city">{train.from_city}</div>
              <div className="summary-time">{formatTime(train.departure)}</div>
            </div>
            <div className="summary-arrow">→</div>
            <div className="summary-point">
              <div className="summary-city">{train.to_city}</div>
              <div className="summary-time">{formatTime(train.arrival)}</div>
            </div>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <Clock size={14} />
              <span>Travel Date</span>
              <span className="summary-val">{formatDate(searchParams.date)}</span>
            </div>
            <div className="summary-row">
              <User size={14} />
              <span>Passengers</span>
              <span className="summary-val">{searchParams.passengers}</span>
            </div>
            <div className="summary-row">
              <IndianRupee size={14} />
              <span>Price per person</span>
              <span className="summary-val">₹{train.price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total Amount</span>
            <span className="total-amount">₹{parseFloat(total).toLocaleString('en-IN')}</span>
          </div>

          <p className="summary-note">
            Your e-ticket will be sent to your email address after confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}

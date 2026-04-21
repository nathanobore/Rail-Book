import { CheckCircle, Brain as TrainIcon, User, Mail, Phone, Calendar, Users, Download, Home } from 'lucide-react';
import { Booking, Train } from '../types';

interface TicketConfirmationProps {
  booking: Booking;
  train: Train;
  onHome: () => void;
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TicketConfirmation({ booking, train, onHome }: TicketConfirmationProps) {
  const shortId = booking.id.split('-')[0].toUpperCase();

  return (
    <section className="confirmation-section">
      <div className="confirmation-header">
        <div className="success-icon">
          <CheckCircle size={52} strokeWidth={1.5} />
        </div>
        <h2 className="confirmation-title">Booking Confirmed!</h2>
        <p className="confirmation-subtitle">
          Your ticket has been successfully booked. Safe travels!
        </p>
      </div>

      <div className="ticket-wrapper">
        <div className="ticket">
          <div className="ticket-header">
            <div className="ticket-logo">
              <TrainIcon size={22} />
              <span>RailBook</span>
            </div>
            <div className="ticket-id">
              <span className="ticket-id-label">Booking ID</span>
              <span className="ticket-id-val">{shortId}</span>
            </div>
          </div>

          <div className="ticket-route">
            <div className="ticket-station">
              <div className="station-city">{train.from_city}</div>
              <div className="station-time">{formatTime(train.departure)}</div>
              <div className="station-label">Departure</div>
            </div>

            <div className="ticket-route-mid">
              <div className="ticket-train-name">{train.name}</div>
              <div className="ticket-track">
                <div className="track-dot"></div>
                <div className="track-line"></div>
                <div className="track-train">🚂</div>
                <div className="track-line"></div>
                <div className="track-dot"></div>
              </div>
            </div>

            <div className="ticket-station ticket-station-right">
              <div className="station-city">{train.to_city}</div>
              <div className="station-time">{formatTime(train.arrival)}</div>
              <div className="station-label">Arrival</div>
            </div>
          </div>

          <div className="ticket-divider">
            <div className="ticket-notch ticket-notch-left"></div>
            <div className="ticket-dashes"></div>
            <div className="ticket-notch ticket-notch-right"></div>
          </div>

          <div className="ticket-details">
            <div className="ticket-detail-item">
              <Calendar size={14} />
              <div>
                <div className="detail-label">Travel Date</div>
                <div className="detail-val">{formatDate(booking.travel_date)}</div>
              </div>
            </div>
            <div className="ticket-detail-item">
              <Users size={14} />
              <div>
                <div className="detail-label">Passengers</div>
                <div className="detail-val">{booking.passengers}</div>
              </div>
            </div>
            <div className="ticket-detail-item">
              <User size={14} />
              <div>
                <div className="detail-label">Passenger</div>
                <div className="detail-val">{booking.passenger_name}</div>
              </div>
            </div>
            <div className="ticket-detail-item">
              <Mail size={14} />
              <div>
                <div className="detail-label">Email</div>
                <div className="detail-val">{booking.email}</div>
              </div>
            </div>
            <div className="ticket-detail-item">
              <Phone size={14} />
              <div>
                <div className="detail-label">Phone</div>
                <div className="detail-val">{booking.phone}</div>
              </div>
            </div>
            <div className="ticket-detail-item ticket-total">
              <div className="total-label">Total Paid</div>
              <div className="total-price">₹{booking.total_price.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="ticket-barcode">
            <div className="barcode-bars">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="barcode-bar" style={{ height: `${20 + Math.random() * 20}px` }}></div>
              ))}
            </div>
            <span className="barcode-text">{booking.id.replace(/-/g, '').toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="action-btn action-btn-secondary" onClick={() => window.print()}>
          <Download size={16} /> Download Ticket
        </button>
        <button className="action-btn action-btn-primary" onClick={onHome}>
          <Home size={16} /> Book Another Ticket
        </button>
      </div>
    </section>
  );
}

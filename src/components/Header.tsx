import { Brain as Train } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="railbook-header">
      <div className="header-inner">
        <button className="logo-btn" onClick={onReset} aria-label="Go to home">
          <div className="logo-icon">
            <Train size={28} strokeWidth={2.5} />
          </div>
          <div className="logo-text">
            <span className="logo-name">RailBook</span>
            <span className="logo-tagline">Fast. Simple. On Track.</span>
          </div>
        </button>
        <nav className="header-nav">
          <span className="nav-badge">
            <span className="badge-dot"></span>
            Live Booking
          </span>
        </nav>
      </div>
    </header>
  );
}

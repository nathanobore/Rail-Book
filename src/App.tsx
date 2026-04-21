import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Train, Booking, SearchParams, AppView } from './types';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TrainList from './components/TrainList';
import BookingForm from './components/BookingForm';
import TicketConfirmation from './components/TicketConfirmation';

export default function App() {
  const [view, setView] = useState<AppView>('search');
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from_city: '',
    to_city: '',
    date: '',
    passengers: 1,
  });
  const [searching, setSearching] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setSearching(true);
    setError(null);
    setSearchParams(params);

    const { data, error: err } = await supabase
      .from('trains')
      .select('*')
      .ilike('from_city', params.from_city)
      .ilike('to_city', params.to_city)
      .gt('seats', 0)
      .order('price', { ascending: true });

    setSearching(false);

    if (err) {
      setError('Failed to load trains. Please try again.');
      return;
    }

    setTrains(data || []);
    setView('trains');
  };

  const handleSelectTrain = (train: Train) => {
    setSelectedTrain(train);
    setView('booking');
  };

  const handleBook = async (details: { passenger_name: string; email: string; phone: string }) => {
    if (!selectedTrain) return;
    setBookingLoading(true);
    setError(null);

    const totalPrice = selectedTrain.price * searchParams.passengers;

    const { data, error: err } = await supabase
      .from('bookings')
      .insert({
        train_id: selectedTrain.id,
        passenger_name: details.passenger_name,
        email: details.email,
        phone: details.phone,
        passengers: searchParams.passengers,
        travel_date: searchParams.date,
        total_price: totalPrice,
      })
      .select()
      .single();

    setBookingLoading(false);

    if (err || !data) {
      setError('Booking failed. Please try again.');
      return;
    }

    setConfirmedBooking(data as Booking);
    setView('confirmation');
  };

  const handleReset = () => {
    setView('search');
    setTrains([]);
    setSelectedTrain(null);
    setConfirmedBooking(null);
    setError(null);
  };

  return (
    <div className="app">
      <Header onReset={handleReset} />

      <main className="main-content">
        {error && (
          <div className="global-error">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {view === 'search' && (
          <SearchForm onSearch={handleSearch} loading={searching} />
        )}

        {view === 'trains' && (
          <TrainList
            trains={trains}
            searchParams={searchParams}
            onSelect={handleSelectTrain}
            onBack={() => setView('search')}
          />
        )}

        {view === 'booking' && selectedTrain && (
          <BookingForm
            train={selectedTrain}
            searchParams={searchParams}
            onBook={handleBook}
            onBack={() => setView('trains')}
            loading={bookingLoading}
          />
        )}

        {view === 'confirmation' && confirmedBooking && selectedTrain && (
          <TicketConfirmation
            booking={confirmedBooking}
            train={selectedTrain}
            onHome={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 RailBook &bull; Your trusted train booking companion</p>
      </footer>
    </div>
  );
}

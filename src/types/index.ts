export interface Train {
  id: string;
  name: string;
  from_city: string;
  to_city: string;
  departure: string;
  arrival: string;
  price: number;
  seats: number;
}

export interface Booking {
  id: string;
  train_id: string;
  passenger_name: string;
  email: string;
  phone: string;
  passengers: number;
  travel_date: string;
  total_price: number;
  created_at: string;
}

export interface SearchParams {
  from_city: string;
  to_city: string;
  date: string;
  passengers: number;
}

export type AppView = 'search' | 'trains' | 'booking' | 'confirmation';

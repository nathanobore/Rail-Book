/*
  # RailBook - Train Ticket Booking System

  ## Tables Created

  ### trains
  Stores all available train routes with scheduling and pricing information.
  - id: UUID primary key
  - name: Train name (e.g. "Rajdhani Express")
  - from_city: Departure city
  - departure: Departure time (HH:MM format)
  - arrival: Arrival time (HH:MM format)
  - price: Ticket price per passenger in INR
  - seats: Number of available seats

  ### bookings
  Stores confirmed ticket bookings with passenger details.
  - id: UUID primary key
  - train_id: Foreign key to trains
  - passenger_name: Full name of primary passenger
  - email: Contact email
  - phone: Contact phone number
  - passengers: Number of passengers booked
  - travel_date: Date of travel
  - total_price: Total amount charged

  ## Security
  - RLS enabled on both tables
  - Trains are publicly readable (schedule data)
  - Bookings can be created and read by anonymous users (no auth required)

  ## Seed Data
  - 8 popular Indian railway routes seeded as sample data
*/

CREATE TABLE IF NOT EXISTS trains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  from_city text NOT NULL,
  to_city text NOT NULL,
  departure text NOT NULL,
  arrival text NOT NULL,
  price numeric(10,2) NOT NULL,
  seats integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid REFERENCES trains(id),
  passenger_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  passengers integer NOT NULL DEFAULT 1,
  travel_date date NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view trains"
  ON trains FOR SELECT
  TO anon, authenticated
  USING (seats >= 0);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    passenger_name <> '' AND
    email <> '' AND
    phone <> '' AND
    passengers > 0
  );

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (id IS NOT NULL);

INSERT INTO trains (name, from_city, to_city, departure, arrival, price, seats) VALUES
  ('Rajdhani Express', 'Mumbai', 'Delhi', '06:00', '22:00', 1200.00, 150),
  ('Shatabdi Express', 'Delhi', 'Jaipur', '06:15', '10:45', 650.00, 120),
  ('Duronto Express', 'Kolkata', 'Mumbai', '23:00', '19:30', 1850.00, 200),
  ('Chennai Express', 'Chennai', 'Mumbai', '07:30', '08:45', 980.00, 180),
  ('Tejas Express', 'Mumbai', 'Ahmedabad', '15:00', '21:00', 750.00, 140),
  ('Garib Rath', 'Delhi', 'Kolkata', '08:30', '05:00', 550.00, 300),
  ('Intercity Express', 'Bangalore', 'Chennai', '06:30', '10:00', 320.00, 160),
  ('Superfast Express', 'Hyderabad', 'Pune', '14:00', '22:30', 680.00, 175),
  ('Golden Temple Mail', 'Mumbai', 'Kolkata', '21:10', '23:55', 1450.00, 220),
  ('Coromandel Express', 'Kolkata', 'Chennai', '14:45', '17:00', 1100.00, 190)
ON CONFLICT DO NOTHING;

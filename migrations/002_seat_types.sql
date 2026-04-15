-- Migration: Add seat types/categories

-- Seat types table
CREATE TABLE IF NOT EXISTS seat_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    color VARCHAR(50) NOT NULL DEFAULT 'primary',
    position_priority INTEGER DEFAULT 1
);

-- Insert seat types (INR pricing)
INSERT INTO seat_types (name, display_name, price, color, position_priority) VALUES
('normal', 'Normal', 150.00, 'surface-container-high', 3),
('deluxe', 'Deluxe', 250.00, 'tertiary', 2),
('recliner', 'Recliner', 400.00, 'primary', 1)
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price;

-- Add type and position columns to seats
ALTER TABLE seats ADD COLUMN IF NOT EXISTS seat_type_id INTEGER REFERENCES seat_types(id) DEFAULT 1;
ALTER TABLE seats ADD COLUMN IF NOT EXISTS row_label VARCHAR(1);
ALTER TABLE seats ADD COLUMN IF NOT EXISTS seat_number INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM seats WHERE row_label IS NOT NULL) THEN
        DELETE FROM bookings;
        DELETE FROM seats;

        INSERT INTO seats (row_label, seat_number, seat_type_id)
        SELECT 
            CHR(65 + row_num) as row_label,
            seat_num as seat_number,
            CASE 
                WHEN row_num = 7 THEN 3  -- Row H: Recliner (last row)
                WHEN row_num IN (5, 6) THEN 2  -- Rows F-G: Deluxe
                ELSE 1                    -- Rows A-E: Normal
            END as seat_type_id
        FROM generate_series(0, 7) as row_num
        CROSS JOIN generate_series(1, 10) as seat_num;
    END IF;
END $$;

-- Create index for seat queries
CREATE INDEX IF NOT EXISTS idx_seats_type ON seats(seat_type_id);

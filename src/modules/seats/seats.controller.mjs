import pool from '../../lib/db.mjs';

export const getSeatsForShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    const showtimeCheck = await pool.query('SELECT id FROM showtimes WHERE id = $1', [showtimeId]);
    if (showtimeCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Showtime not found' });
    }
    
    const seatsResult = await pool.query('SELECT id FROM seats ORDER BY id');
    const bookingsResult = await pool.query(
      'SELECT seat_id, user_id FROM bookings WHERE showtime_id = $1',
      [showtimeId]
    );
    
    const bookedSeats = new Map(bookingsResult.rows.map(b => [b.seat_id, b.user_id]));
    
    const seats = seatsResult.rows.map(seat => ({
      id: seat.id,
      isBooked: bookedSeats.has(seat.id),
      bookedBy: bookedSeats.get(seat.id) || null
    }));
    
    res.json({ seats });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};
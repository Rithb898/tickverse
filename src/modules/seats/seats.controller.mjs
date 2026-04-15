import pool from '../../lib/db.mjs';

export const getSeatsForShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    const showtimeCheck = await pool.query('SELECT id FROM showtimes WHERE id = $1', [showtimeId]);
    if (showtimeCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Showtime not found' });
    }
    
    const seatsResult = await pool.query(`
      SELECT s.id, s.row_label, s.seat_number, 
             st.name as type_name, st.display_name as type_display_name, 
             st.price, st.color
      FROM seats s
      JOIN seat_types st ON s.seat_type_id = st.id
      ORDER BY s.row_label, s.seat_number
    `);
    
    const bookingsResult = await pool.query(
      'SELECT seat_id, user_id FROM bookings WHERE showtime_id = $1',
      [showtimeId]
    );
    
    const bookedSeats = new Map(bookingsResult.rows.map(b => [b.seat_id, b.user_id]));
    
    const seats = seatsResult.rows.map(seat => ({
      id: seat.id,
      rowLabel: seat.row_label,
      seatNumber: seat.seat_number,
      label: `${seat.row_label}${seat.seat_number}`,
      type: seat.type_name,
      typeDisplayName: seat.type_display_name,
      price: parseFloat(seat.price),
      color: seat.color,
      isBooked: bookedSeats.has(seat.id),
      bookedBy: bookedSeats.get(seat.id) || null
    }));
    
    res.json({ seats });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};
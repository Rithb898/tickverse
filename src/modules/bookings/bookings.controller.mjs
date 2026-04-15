import pool from "../../lib/db.mjs";

export const createBooking = async (req, res) => {
  try {
    const { seatIds, showtimeId } = req.body;
    const userId = req.userId;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "Seat IDs are required" });
    }

    if (!showtimeId) {
      return res.status(400).json({ error: "Showtime ID is required" });
    }

    const conn = await pool.connect();

    try {
      await conn.query("BEGIN");

      for (const seatId of seatIds) {
        const checkResult = await conn.query(
          "SELECT * FROM bookings WHERE seat_id = $1 AND showtime_id = $2 FOR UPDATE",
          [seatId, showtimeId],
        );

        if (checkResult.rowCount > 0) {
          await conn.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: `Seat ${seatId} is already booked` });
        }
      }

      for (const seatId of seatIds) {
        await conn.query(
          "INSERT INTO bookings (user_id, seat_id, showtime_id) VALUES ($1, $2, $3)",
          [userId, seatId, showtimeId],
        );
      }

      await conn.query("COMMIT");
      res.json({
        success: true,
        bookedSeats: seatIds,
        message: "Booking successful",
      });
    } catch (error) {
      await conn.query("ROLLBACK");
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Booking failed" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT b.id as booking_id, b.booking_time, b.seat_id, b.showtime_id,
             s.show_time, s.screen_number, m.title, m.poster_path, m.tmdb_id,
             se.row_label, se.seat_number
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN seats se ON b.seat_id = se.id
      WHERE b.user_id = $1 ORDER BY b.booking_time DESC
    `,
      [req.userId],
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [req.params.id, req.userId],
    );

    if (bookingResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or not authorized" });
    }

    const booking = bookingResult.rows[0];
    await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

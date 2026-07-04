const express = require('express');
const app = express();
app.use(express.json());

// A simple in-memory store for bookings for the sake of the example
const bookings = [];

app.post('/api/bookings', (req, res) => {
    const newBooking = req.body;
    // Check for conflicts
    const conflict = bookings.find(booking =>
        booking.date === newBooking.date && booking.timeSlot === newBooking.timeSlot
    );

    if (conflict) {
        return res.status(409).json({ error: 'Conflict detected: A booking for this date and time already exists.' });
    }

    newBooking.id = bookings.length + 1;
    bookings.push(newBooking);
    res.status(201).json(newBooking);
});


if (require.main === module) {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
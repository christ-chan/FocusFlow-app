// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock database table: bookings
let bookingsDB = [
  { id: '1', date: '2026-07-10', timeSlot: '10:00 AM', plan: 'Basic Consultation' },
  { id: '2', date: '2026-07-10', timeSlot: '02:00 PM', plan: 'Deep Dive Session' }
];

// Helper to check for existing schedule conflicts
const isConflict = (date, timeSlot) => {
  return bookingsDB.some(
    (b) => b.date === date && b.timeSlot === timeSlot
  );
};

// GET: Fetch all booked slots to populate the frontend calendar view
app.get('/api/bookings', (req, res) => {
  try {
    res.status(200).json(bookingsDB);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Book an appointment with conflict validation
app.post('/api/bookings', (req, res) => {
  const { name, email, date, timeSlot, plan } = req.body;

  // 1. Basic Payload Validation
  if (!name || !email || !date || !timeSlot || !plan) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  // 2. Conflict Filtering / Duplicate Prevention Logic
  if (isConflict(date, timeSlot)) {
    return res.status(409).json({ 
      error: 'Conflict detected. This time slot has already been booked.' 
    });
  }

  // 3. Insert into Database
  const newBooking = {
    id: String(bookingsDB.length + 1),
    name,
    email,
    date,
    timeSlot,
    plan
  };

  bookingsDB.push(newBooking);
  return res.status(201).json(newBooking);
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Exported for testing purposes

// api/controllers/bookingController.js

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

const getBookings = (req, res) => {
  try {
    res.status(200).json(bookingsDB);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createBooking = (req, res) => {
  const { name, email, date, timeSlot, plan } = req.body;

  // Basic validation
  if (!name || !email || !date || !timeSlot || !plan) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Conflict validation
  if (isConflict(date, timeSlot)) {
    return res.status(409).json({ error: 'This time slot is no longer available. Please select another time.' });
  }

  // Add booking to the mock database
  const newBooking = {
    id: String(Date.now()), // simple unique ID
    name,
    email,
    date,
    timeSlot,
    plan,
  };
  bookingsDB.push(newBooking);

  console.log('New booking added:', newBooking);
  console.log('Current bookings:', bookingsDB);

  res.status(201).json(newBooking);
};

module.exports = {
  getBookings,
  createBooking,
};
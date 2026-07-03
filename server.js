// server.js
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./api/routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

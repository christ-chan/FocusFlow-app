// server.test.js
const request = require('supertest');
const app = require('./server'); 

describe('Booking API Conflict Filtering', () => {
  
  it('should successfully create a unique booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        date: '2026-07-15',
        timeSlot: '09:00 AM',
        plan: 'Basic Consultation'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should reject a duplicate booking with a 409 Conflict status', async () => {
    const bookingPayload = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      date: '2026-07-20',
      timeSlot: '11:00 AM',
      plan: 'Deep Dive Session'
    };

    // First booking attempt succeeds
    await request(app).post('/api/bookings').send(bookingPayload);

    // Second booking attempt with the same date/time fails
    const duplicateRes = await request(app).post('/api/bookings').send(bookingPayload);

    expect(duplicateRes.statusCode).toEqual(409);
    expect(duplicateRes.body.error).toContain('Conflict detected');
  });
});
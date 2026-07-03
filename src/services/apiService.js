const getBookings = async () => {
    const response = await fetch('/api/bookings');
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    return response.json();
};

const createBooking = async (bookingData) => {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to create booking');
    }
    return response.json();
};

export { getBookings, createBooking };

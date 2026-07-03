import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import TimeSlotList from './components/TimeSlotList';
import BookingForm from './components/BookingForm';
import ConfirmationView from './components/ConfirmationView';
import { getBookings, createBooking } from './services/apiService';
import FocusFlowApp from './FocusFlowApp'; // Import the FocusFlowApp

export default function SchedulingApp() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', plan: 'Basic Consultation' });
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [view, setView] = useState('schedule'); // 'schedule' or 'focus'

    const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getBookings();
                setBookings(data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };
        if (view === 'schedule') {
            fetchBookings();
        }
    }, [view]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
        setConfirmation(null);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setConfirmation(null);

        if (!selectedTimeSlot) {
            setError('Please select a time slot.');
            return;
        }

        const bookingData = {
            ...formData,
            date: selectedDate.toISOString().split('T')[0],
            timeSlot: selectedTimeSlot,
        };

        try {
            const newBooking = await createBooking(bookingData);
            setBookings([...bookings, newBooking]);
            setConfirmation(newBooking);
            setSelectedTimeSlot(null);
            setFormData({ name: '', email: '', plan: 'Basic Consultation' });
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (date) => date.toISOString().split('T')[0];

    const bookedSlotsForSelectedDate = bookings
        .filter(b => b.date === formatDate(selectedDate))
        .map(b => b.timeSlot);

    const availableTimeSlots = allTimeSlots.filter(slot => !bookedSlotsForSelectedDate.includes(slot));

    if (view === 'focus') {
        return (
            <div>
                <button onClick={() => setView('schedule')} className="m-4 p-2 bg-blue-500 text-white rounded">
                    Back to Schedule
                </button>
                <FocusFlowApp />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
             <div className="flex justify-end">
                <button onClick={() => setView('focus')} className="mb-4 p-2 bg-green-500 text-white rounded">
                    Go to Task List
                </button>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <CalendarView
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    bookings={bookings}
                    allTimeSlots={allTimeSlots}
                />
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Book Your Appointment</h2>
                    {confirmation ? (
                        <ConfirmationView confirmation={confirmation} onMakeAnotherBooking={() => setConfirmation(null)} />
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold mb-2">Available Slots for {selectedDate.toDateString()}</h3>
                            <TimeSlotList
                                availableTimeSlots={availableTimeSlots}
                                selectedTimeSlot={selectedTimeSlot}
                                onSelectTimeSlot={setSelectedTimeSlot}
                            />
                            <BookingForm
                                formData={formData}
                                onFormChange={handleFormChange}
                                onSubmit={handleSubmit}
                                error={error}
                                selectedTimeSlot={selectedTimeSlot}
                                availableTimeSlots={availableTimeSlots}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Calendar.css';

const CalendarView = ({ selectedDate, onDateChange, bookings, allTimeSlots }) => {
    const formatDate = (date) => date.toISOString().split('T')[0];

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
        }
        return false;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = formatDate(date);
            const bookingsForDate = bookings.filter(b => b.date === dateString);
            if (bookingsForDate.length >= allTimeSlots.length) {
                return 'fully-booked';
            }
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Select a Date</h2>
            <Calendar
                onChange={onDateChange}
                value={selectedDate}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
            />
        </div>
    );
};

export default CalendarView;

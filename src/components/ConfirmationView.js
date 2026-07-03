import React from 'react';

const ConfirmationView = ({ confirmation, onMakeAnotherBooking }) => {
    if (!confirmation) return null;

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-green-600 mb-2">Booking Successful!</h3>
            <p><strong>Name:</strong> {confirmation.name}</p>
            <p><strong>Email:</strong> {confirmation.email}</p>
            <p><strong>Date:</strong> {new Date(confirmation.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {confirmation.timeSlot}</p>
            <p><strong>Plan:</strong> {confirmation.plan}</p>
            <button onClick={onMakeAnotherBooking} className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Make Another Booking</button>
        </div>
    );
};

export default ConfirmationView;

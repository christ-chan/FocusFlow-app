import React from 'react';

const BookingForm = ({ formData, onFormChange, onSubmit, availablePlans, error, selectedTimeSlot, availableTimeSlots }) => {
    const availablePlans = [
        { id: 1, name: 'Basic Consultation', duration: '30 min' },
        { id: 2, name: 'Deep Dive Session', duration: '1 hour' },
        { id: 3, name: 'Project Planning', duration: '2 hours' },
    ];
    
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={onFormChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Choose a Plan</label>
                <select id="plan" name="plan" value={formData.plan} onChange={onFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    {availablePlans.map(plan => (
                        <option key={plan.id} value={plan.name}>{plan.name} ({plan.duration})</option>
                    ))}
                </select>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700" disabled={!selectedTimeSlot || availableTimeSlots.length === 0}>
                Book Now
            </button>
        </form>
    );
};

export default BookingForm;

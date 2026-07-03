import React from 'react';

const TimeSlotList = ({ availableTimeSlots, selectedTimeSlot, onSelectTimeSlot }) => {
    return (
        <div className="grid grid-cols-3 gap-2 mb-4">
            {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map(slot => (
                    <button
                        key={slot}
                        onClick={() => onSelectTimeSlot(slot)}
                        className={`p-2 rounded-lg text-sm ${selectedTimeSlot === slot ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        {slot}
                    </button>
                ))
            ) : (
                <p className="text-gray-500 col-span-3">No available slots for this date.</p>
            )}
        </div>
    );
};

export default TimeSlotList;

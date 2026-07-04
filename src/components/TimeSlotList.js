import React from 'react';

const TimeSlotList = ({ availableTimeSlots, selectedTimeSlot, onSelectTimeSlot, selectedDate }) => {
    const isTimeSlotPast = (timeSlot) => {
        const now = new Date();
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight case
        
        const slotTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hours, minutes);
        
        return now > slotTime;
    };

    return (
        <div className="grid grid-cols-3 gap-2 mb-4">
            {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map(slot => {
                    const isPast = isTimeSlotPast(slot);
                    return (
                        <button
                            key={slot}
                            onClick={() => onSelectTimeSlot(slot)}
                            className={`p-2 rounded-lg text-sm ${
                                isPast
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : selectedTimeSlot === slot
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                            disabled={isPast}
                        >
                            {slot}
                        </button>
                    );
                })
            ) : (
                <p className="text-gray-500 col-span-3">No available slots for this date.</p>
            )}
        </div>
    );
};

export default TimeSlotList;

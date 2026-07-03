import React, { useState, useEffect } from 'react';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
const PLANS = [
  { id: 'p1', name: 'Basic Consultation', duration: '30 min' },
  { id: 'p2', name: 'Deep Dive Session', duration: '1 hour' },
];

export default function SchedulingApp() {
  const [existingBookings, setExistingBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2026-07-10'); // Example locked date anchor
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const [uiError, setUiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch real-time busy schedules from Node API
  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => setExistingBookings(data))
      .catch(() => setUiError('Failed to load active schedule calendar data.'));
  }, [successMessage]);

  // Frontend Filter: Compute which slots are already taken for the selected day
  const takenSlotsOnSelectedDate = existingBookings
    .filter((booking) => booking.date === selectedDate)
    .map((booking) => booking.timeSlot);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError('');
    setSuccessMessage('');

    if (!selectedSlot || !selectedPlan || !formData.name || !formData.email) {
      setUiError('All fields are strictly required.');
      return;
    }

    // Double check conflict client-side before sending network payload
    if (takenSlotsOnSelectedDate.includes(selectedSlot)) {
      setUiError('This slot was just taken. Please select another time.');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          timeSlot: selectedSlot,
          plan: selectedPlan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server rejected booking.');
      }

      setSuccessMessage(`Appointment successfully confirmed for ${result.timeSlot}!`);
      setSelectedSlot('');
      setFormData({ name: '', email: '' });
    } catch (err) {
      setUiError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        
        {/* Left Column: Schedule Visualizer */}
        <div className="bg-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <span className="text-blue-400 font-semibold tracking-wider text-xs uppercase">Step 1: Choose Timing</span>
            <h2 className="text-3xl font-bold mt-1 mb-4">Availability Calendar</h2>
            <p className="text-slate-400 text-sm mb-6">Showing available availability windows for <span className="text-white font-medium">{selectedDate}</span>.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isBooked = takenSlotsOnSelectedDate.includes(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all duration-150 text-center
                      ${isBooked ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed line-through' : ''}
                      ${!isBooked && !isSelected ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500 text-slate-200' : ''}
                      ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' : ''}
                    `}
                  >
                    {slot} {isBooked && '(Booked)'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            Conflicting times are automatically omitted dynamically.
          </div>
        </div>

        {/* Right Column: Register Plan List Form */}
        <div className="p-8 flex flex-col justify-between bg-white">
          <div>
            <span className="text-blue-600 font-semibold tracking-wider text-xs uppercase">Step 2: Assign Plan</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-1 mb-6">Register Booking</h2>

            {uiError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">{uiError}</div>}
            {successMessage && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Registration Tier</label>
                <div className="space-y-2">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all
                        ${selectedPlan === plan.name ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="plan"
                          checked={selectedPlan === plan.name}
                          onChange={() => setSelectedPlan(plan.name)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-900">{plan.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{plan.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
                disabled={!selectedSlot || !selectedPlan}
              >
                {selectedSlot ? `Book Appointment at ${selectedSlot}` : 'Select a Time Slot'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

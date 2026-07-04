import React, { useState, useEffect, useMemo } from 'react';
import CalendarView from './components/CalendarView';
import TimeSlotList from './components/TimeSlotList';
import BookingForm from './components/BookingForm';
import ConfirmationView from './components/ConfirmationView';
import AdminDashboard from './components/AdminDashboard';
import { getBookings, createBooking } from './services/apiService';
import FocusFlowApp from './FocusFlowApp';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_EMAIL = "your-admin-email@example.com";
const SLOT_DURATION = 60; // Keep slot duration configurable here for now

const availablePlans = [
    { id: 1, name: 'Basic Consultation', duration: '30 min' },
    { id: 2, name: 'Deep Dive Session', duration: '1 hour' },
    { id: 3, name: 'Project Planning', duration: '2 hours' },
];

export default function SchedulingApp() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', plan: 'Basic Consultation' });
    const [errors, setErrors] = useState({});
    const [confirmation, setConfirmation] = useState(null);
    const [view, setView] = useState('schedule');
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [businessHours, setBusinessHours] = useState(null);

    useEffect(() => {
        const fetchBusinessHours = async () => {
            const docRef = doc(db, 'settings', 'businessHours');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setBusinessHours(docSnap.data());
            } else {
                // Set default hours if not found in DB
                setBusinessHours({ start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' });
            }
        };
        fetchBusinessHours();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAdmin(currentUser && currentUser.email === ADMIN_EMAIL);
        });
        return () => unsubscribe();
    }, []);

    const allTimeSlots = useMemo(() => {
        if (!businessHours) return [];
        const slots = [];
        const [startHour, startMinute] = businessHours.start.split(':').map(Number);
        const [endHour, endMinute] = businessHours.end.split(':').map(Number);
        const [lunchStartHour] = businessHours.lunchStart.split(':').map(Number);
        const [lunchEndHour] = businessHours.lunchEnd.split(':').map(Number);

        let current = new Date();
        current.setHours(startHour, startMinute, 0, 0);
        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);

        while (current < end) {
            const currentHour = current.getHours();
            if (currentHour < lunchStartHour || currentHour >= lunchEndHour) {
                slots.push(current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
            }
            current.setMinutes(current.getMinutes() + SLOT_DURATION);
        }
        return slots;
    }, [businessHours]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (view === 'schedule' || view === 'admin') {
                try {
                    const data = await getBookings();
                    setBookings(data);
                } catch (err) {
                    console.error("Error fetching bookings:", err);
                }
            }
        };
        fetchBookings();
    }, [view]);
    
    // ... (other handlers)

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setView('schedule');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const formatDate = (date) => date.toISOString().split('T')[0];
    const bookedSlotsForSelectedDate = bookings.filter(b => b.date === formatDate(selectedDate)).map(b => b.timeSlot);
    const availableTimeSlots = allTimeSlots.filter(slot => !bookedSlotsForSelectedDate.includes(slot));


    const renderHeader = () => (
        <div className="flex justify-end p-4 bg-gray-100">
            {user ? (
                <div className="flex items-center">
                    <p className="mr-4">Welcome, {user.displayName}!</p>
                    {isAdmin && <button onClick={() => setView('admin')} className="mr-4 p-2 bg-yellow-500 text-white rounded">Admin</button>}
                    <button onClick={handleSignOut} className="p-2 bg-red-500 text-white rounded">Sign Out</button>
                    <button onClick={() => setView('focus')} className="ml-4 p-2 bg-green-500 text-white rounded">Go to Task List</button>
                </div>
            ) : (
                <button onClick={handleGoogleSignIn} className="p-2 bg-blue-500 text-white rounded">Admin Login</button>
            )}
        </div>
    );

    if (isAdmin && view === 'admin') {
        return (
            <div className="min-h-screen bg-gray-100">
                {renderHeader()}
                <div className="p-4 sm:p-6 md:p-8">
                    <AdminDashboard onBack={() => setView('schedule')} />
                </div>
            </div>
        );
    }

    if (view === 'focus') {
        return (
             <div className="min-h-screen bg-gray-100">
                {renderHeader()}
                <FocusFlowApp />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {renderHeader()}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-6 md:p-8">
                <CalendarView selectedDate={selectedDate} onDateChange={()=>{}} bookings={bookings} allTimeSlots={allTimeSlots} />
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Book Your Appointment</h2>
                    {confirmation ? (
                        <ConfirmationView confirmation={confirmation} onMakeAnotherBooking={() => setConfirmation(null)} />
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold mb-2">Available Slots for {selectedDate.toDateString()}</h3>
                            <TimeSlotList availableTimeSlots={availableTimeSlots} selectedTimeSlot={selectedTimeSlot} onSelectTimeSlot={()=>{}} selectedDate={selectedDate} />
                            {errors.timeSlot && <p className="text-red-500 text-sm mt-2">{errors.timeSlot}</p>}
                            <BookingForm formData={formData} onFormChange={()=>{}} onSubmit={()=>{}} errors={errors} selectedTimeSlot={selectedTimeSlot} availableTimeSlots={availableTimeSlots} availablePlans={availablePlans} />
                            {errors.general && <p className="text-red-500 text-sm mt-4">{errors.general}</p>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

const AdminDashboard = ({ onBack }) => {
    const [businessHours, setBusinessHours] = useState({ start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' });
    const [status, setStatus] = useState('');
    const [exportStatus, setExportStatus] = useState('');

    useEffect(() => {
        const fetchBusinessHours = async () => {
            const docRef = doc(db, 'settings', 'businessHours');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setBusinessHours(docSnap.data());
            }
        };
        fetchBusinessHours();
    }, []);

    const handleHoursChange = (e) => {
        setBusinessHours({ ...businessHours, [e.target.name]: e.target.value });
    };

    const handleSaveHours = async () => {
        setStatus('Saving...');
        try {
            await setDoc(doc(db, 'settings', 'businessHours'), businessHours);
            setStatus('Business hours updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error("Error saving business hours: ", error);
            setStatus('Error saving hours. Please try again.');
        }
    };

    const handleExportCSV = async () => {
        setExportStatus('Exporting...');
        try {
            const bookingsSnapshot = await getDocs(collection(db, "bookings"));
            const bookings = bookingsSnapshot.docs.map(doc => doc.data());

            if (bookings.length === 0) {
                setExportStatus('No bookings to export.');
                setTimeout(() => setExportStatus(''), 3000);
                return;
            }

            // CSV header
            const header = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Description'];
            
            // CSV rows
            const rows = bookings.map(booking => {
                const startDate = new Date(booking.start);
                const endDate = new Date(booking.end);
                const subject = booking.title;
                const description = `Plan: ${booking.plan}\nClient: ${booking.name} (${booking.email})`;

                return [
                    subject,
                    startDate.toLocaleDateString(),
                    startDate.toLocaleTimeString(),
                    endDate.toLocaleDateString(),
                    endDate.toLocaleTimeString(),
                    description
                ];
            });

            // Combine header and rows
            let csvContent = "data:text/csv;charset=utf-8," 
                + header.join(",") + "\n" 
                + rows.map(e => e.join(",")).join("\n");

            // Create a link and trigger the download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "bookings.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setExportStatus('Export successful!');
            setTimeout(() => setExportStatus(''), 3000);

        } catch (error) {
            console.error("Error exporting CSV: ", error);
            setExportStatus('Error exporting CSV. Please try again.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <button onClick={onBack} className="p-2 bg-blue-500 text-white rounded">Back to Scheduler</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Manage Business Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" name="start" value={businessHours.start} onChange={handleHoursChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" name="end" value={businessHours.end} onChange={handleHoursChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="lunchStart" className="block text-sm font-medium text-gray-700">Lunch Start</label>
                            <input type="time" name="lunchStart" value={businessHours.lunchStart} onChange={handleHoursChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="lunchEnd" className="block text-sm font-medium text-gray-700">Lunch End</label>
                            <input type="time" name="lunchEnd" value={businessHours.lunchEnd} onChange={handleHoursChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                    <button onClick={handleSaveHours} className="mt-4 p-2 bg-green-500 text-white rounded">Save Hours</button>
                    {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Data Management</h3>
                    <div className="flex items-center">
                        <button onClick={handleExportCSV} className="p-2 bg-purple-500 text-white rounded">Export Bookings to CSV</button>
                    </div>
                    {exportStatus && <p className="mt-2 text-sm text-gray-600">{exportStatus}</p>}
                </div>
            </div>

             <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Bookings</h3>
                 <p className="text-gray-500">Displaying booked data in the calendar is coming soon.</p>
             </div>
        </div>
    );
};

export default AdminDashboard;

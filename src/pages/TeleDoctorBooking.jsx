import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import PatientGlassSidebar from '../components/dashboard/PatientGlassSidebar';

export default function TeleDoctorBooking() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { doctors, appointments, requestAppointment, approveAppointment, cancelAppointment } = useAppointmentStore();

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingStep, setBookingStep] = useState('list'); // list, confirm, waiting

    // Poll for approval simulation
    const myAppointments = appointments.filter(a => a.patientId === user?.id);
    const activeAppointment = myAppointments.find(a => a.status === 'approved' || a.status === 'pending');

    // Robust Auto-Approval Effect (Handles refreshes!)
    useEffect(() => {
        if (activeAppointment?.status === 'pending') {
            console.log("Found pending appointment, scheduling approval...");
            const timer = setTimeout(() => {
                console.log("Approving appointment:", activeAppointment.id);
                approveAppointment(activeAppointment.id);
            }, 3000); // 3 seconds delay for effect
            return () => clearTimeout(timer);
        }
    }, [activeAppointment, approveAppointment]);

    // Imperative Booking
    const handleBook = () => {
        if (!selectedDoctor || !selectedTime) return;
        requestAppointment(user.id, selectedDoctor.id, new Date().toISOString().split('T')[0], selectedTime);
        setBookingStep('waiting');
    };

    const handleCancel = () => {
        if (activeAppointment) {
            cancelAppointment(activeAppointment.id);
            setBookingStep('list');
        }
    };

    const handleJoinSession = () => {
        navigate('/live-session', { state: { doctor: activeAppointment?.doctorId, appointmentId: activeAppointment?.id } });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="flex h-screen w-full bg-[#0f1014] text-white font-sans overflow-hidden">
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Background Noise Texture (Subtle) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

                <header className="h-20 flex items-center justify-between px-8 z-10 border-b border-white/5 bg-[#0f1014]/50 backdrop-blur-md">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">medical_services</span>
                            Find a Specialist
                        </h1>
                        <p className="text-xs text-slate-400">Book your tele-rehabilitation session.</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth z-10">
                    <div className="max-w-6xl mx-auto">

                        {/* Active Appointment Banner */}
                        <AnimatePresence>
                            {activeAppointment && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-8 p-6 rounded-2xl border ${activeAppointment.status === 'approved' ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} flex items-center justify-between backdrop-blur-md`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-12 rounded-full flex items-center justify-center ${activeAppointment.status === 'approved' ? 'bg-green-500 text-[#0f1014]' : 'bg-yellow-500 text-[#0f1014]'}`}>
                                            <span className="material-symbols-outlined text-2xl">
                                                {activeAppointment.status === 'approved' ? 'videocam' : 'schedule'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {activeAppointment.status === 'approved' ? 'Session Ready' : 'Appointment Pending'}
                                            </h3>
                                            <p className="text-sm opacity-70">
                                                {activeAppointment.status === 'approved'
                                                    ? 'Doctor has joined. Click to start.'
                                                    : 'Waiting for doctor confirmation...'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {activeAppointment.status === 'pending' && (
                                            <button onClick={handleCancel} className="px-4 py-2 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-bold transition-colors">
                                                Cancel Request
                                            </button>
                                        )}
                                        {activeAppointment.status === 'approved' ? (
                                            <button onClick={handleJoinSession} className="px-6 py-3 bg-green-500 hover:bg-green-400 text-[#0f1014] rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 flex items-center gap-2">
                                                <span className="material-symbols-outlined">call</span>
                                                Join Now
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 text-yellow-500 text-sm font-bold animate-pulse">
                                                <span className="material-symbols-outlined">hourglass_top</span>
                                                Processing
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Doctor List */}
                        {!activeAppointment && (
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {doctors.map(doc => (
                                    <div key={doc.id} className={`group p-6 rounded-3xl bg-[#18191d]/80 border ${selectedDoctor?.id === doc.id ? 'border-primary shadow-[0_0_20px_rgba(5,204,204,0.1)]' : 'border-white/5 hover:border-white/10'} backdrop-blur-sm transition-all cursor-pointer`} onClick={() => setSelectedDoctor(doc)}>
                                        <div className="flex gap-5">
                                            <div className="relative">
                                                <img src={doc.image} alt={doc.name} className="size-24 rounded-2xl object-cover" />
                                                <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-[#18191d] ${doc.status === 'Online' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{doc.name}</h3>
                                                        <p className="text-sm text-slate-400">{doc.specialty}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/5 px-2 py-1 rounded-lg">
                                                        <span className="material-symbols-outlined text-sm">star</span>
                                                        <span className="text-xs font-bold">{doc.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {doc.availability.map(time => (
                                                        <button
                                                            key={time}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doc); setSelectedTime(time); }}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedDoctor?.id === doc.id && selectedTime === time
                                                                ? 'bg-primary text-[#0f1014] border-primary'
                                                                : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Booking Action Bar */}
                        {!activeAppointment && selectedDoctor && selectedTime && (
                            <div className="fixed bottom-0 left-0 w-full p-6 z-50 pointer-events-none">
                                <div className="max-w-6xl mx-auto flex justify-end">
                                    <div className="bg-[#18191d] border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-6 pointer-events-auto animate-slide-up">
                                        <div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wider">Appointment Summary</div>
                                            <div className="font-bold text-white">{selectedDoctor.name} • Today at {selectedTime}</div>
                                        </div>
                                        <button onClick={handleBook} className="px-6 py-3 bg-primary hover:bg-primary/90 text-[#0f1014] rounded-xl font-bold transition-colors">
                                            Request Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}

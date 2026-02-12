import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// 3D Calendar Day Cell
function CalendarDay3D({ day, appointments, isToday, isSelected, onClick, index }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 400, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`relative cursor-pointer group ${!day ? 'invisible' : ''}`}
            style={{ perspective: 500 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.05, z: 10 }}
                className={`aspect-square p-2 rounded-xl transition-all ${isToday
                        ? 'bg-gradient-to-br from-primary/20 to-cyan-400/20 border-2 border-primary'
                        : isSelected
                            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500'
                            : appointments.length > 0
                                ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                                : 'bg-white/5 border border-white/5 hover:border-white/10'
                    }`}
            >
                <div className="relative z-10 h-full flex flex-col">
                    <div className={`text-sm font-bold mb-1 ${isToday ? 'text-primary' : 'text-white'}`}>
                        {day}
                    </div>

                    {appointments.length > 0 && (
                        <div className="flex-1 space-y-1 overflow-hidden">
                            {appointments.slice(0, 2).map((appt, i) => (
                                <div
                                    key={i}
                                    className="text-[9px] px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded text-primary font-bold truncate"
                                >
                                    {appt.time}
                                </div>
                            ))}
                            {appointments.length > 2 && (
                                <div className="text-[9px] text-slate-400 font-bold">
                                    +{appointments.length - 2} more
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// 3D Appointment Card
function AppointmentCard3D({ appointment, index, onAction }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 400, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const typeColors = {
        'Video Consultation': 'bg-primary/20 text-primary border-primary/30',
        'Follow-up': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'Initial Assessment': 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.02, z: 10 }}
                className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-lg relative overflow-hidden"
            >
                {/* Shine Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.1), transparent 50%)`
                    }}
                />

                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center min-w-[70px]">
                    <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl text-center">
                        <p className="text-xs text-primary font-bold">{appointment.time}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{appointment.duration || '30m'}</p>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 relative z-10">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-bold text-white text-base mb-1 group-hover:text-primary transition-colors">
                                {appointment.name}
                            </h4>
                            <p className="text-sm text-slate-400">{appointment.injury}</p>
                        </div>

                        <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${typeColors[appointment.type] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                            {appointment.type}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAction(appointment, 'call')}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
                        >
                            <span className="material-symbols-outlined text-base">videocam</span>
                            Join Call
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all"
                        >
                            Reschedule
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg text-white">more_horiz</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ScheduleView({ patients }) {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(15); // For calendar view

    // Generate mock appointments
    const generateAppointments = () => {
        return [
            { id: 1, name: "Alex Morgan", injury: "ACL Tear", time: "09:00 AM", duration: "45m", type: "Video Consultation" },
            { id: 2, name: "Marcus Johnson", injury: "Rotator Cuff", time: "10:00 AM", duration: "30m", type: "Follow-up" },
            { id: 3, name: "Sarah Connor", injury: "Hip Replacement", time: "11:30 AM", duration: "30m", type: "Video Consultation" },
            { id: 4, name: "David Kim", injury: "Ankle Sprain", time: "02:00 PM", duration: "30m", type: "Initial Assessment" },
            { id: 5, name: "Emily Blunt", injury: "Lower Back", time: "03:30 PM", duration: "30m", type: "Video Consultation" },
        ];
    };

    const appointments = generateAppointments();

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        const startDay = 1;
        const totalDays = 31;

        // Empty cells for alignment
        for (let i = 0; i < 2; i++) {
            days.push({ day: null, appointments: [] });
        }

        // Actual days
        for (let i = startDay; i <= totalDays; i++) {
            const dayAppointments = i === 15 ? [
                { time: '9:00 AM' },
                { time: '11:30 AM' },
                { time: '2:00 PM' }
            ] : i === 16 ? [
                { time: '10:00 AM' }
            ] : i === 18 ? [
                { time: '9:00 AM' },
                { time: '3:00 PM' }
            ] : [];

            days.push({ day: i, appointments: dayAppointments });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const stats = [
        { label: 'Total Appointments', value: appointments.length, icon: 'calendar_today', color: 'text-primary' },
        { label: 'Hours Scheduled', value: '3.5h', icon: 'schedule', color: 'text-purple-400' },
        { label: 'Completed', value: '8', icon: 'check_circle', color: 'text-green-400' },
        { label: 'Upcoming', value: appointments.length, icon: 'upcoming', color: 'text-yellow-400' }
    ];

    const handleAppointmentAction = (appointment, action) => {
        if (action === 'call') {
            navigate('/tele-doctor');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-black text-white mb-1">Schedule Management</h2>
                    <p className="text-slate-400 text-sm">Manage your appointments and calendar</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Switcher */}
                    <div className="flex bg-[#1a1d24] rounded-2xl p-1.5 border border-white/10">
                        {['day', 'week', 'month'].map((mode) => (
                            <motion.button
                                key={mode}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode(mode)}
                                className={`px-5 py-2.5 text-xs font-bold rounded-xl capitalize transition-all ${viewMode === mode
                                        ? 'bg-gradient-to-r from-primary to-cyan-400 text-black shadow-lg'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {mode}
                            </motion.button>
                        ))}
                    </div>

                    {/* Add Appointment Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(8, 232, 222, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Appointment
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
                            <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Calendar or Timeline */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {viewMode === 'month' ? (
                            /* Month Calendar View */
                            <motion.div
                                key="month"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-white">December 2024</h3>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-white">chevron_left</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-white">chevron_right</span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 gap-2 mb-3">
                                    {weekDays.map((day) => (
                                        <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {calendarDays.map((dayData, index) => (
                                        <CalendarDay3D
                                            key={index}
                                            day={dayData.day}
                                            appointments={dayData.appointments}
                                            isToday={dayData.day === 15}
                                            isSelected={dayData.day === selectedDay}
                                            onClick={() => dayData.day && setSelectedDay(dayData.day)}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            /* Day Timeline View */
                            <motion.div
                                key="day"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-4"
                            >
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black text-white">Today's Schedule</h3>
                                        <p className="text-sm text-slate-400">December 15, 2024</p>
                                    </div>

                                    <div className="space-y-3">
                                        {appointments.map((appointment, index) => (
                                            <AppointmentCard3D
                                                key={appointment.id}
                                                appointment={appointment}
                                                index={index}
                                                onAction={handleAppointmentAction}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Today's Summary & Upcoming */}
                <div className="space-y-6">
                    {/* Today's Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">today</span>
                            Today's Summary
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-slate-400">Total Appointments</span>
                                <span className="text-lg font-black text-primary">5</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-slate-400">Completed</span>
                                <span className="text-lg font-black text-green-400">2</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-sm text-slate-400">Remaining</span>
                                <span className="text-lg font-black text-yellow-400">3</span>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Daily Progress</span>
                                    <span className="text-primary font-bold">40%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '40%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary to-cyan-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-[#1a1d24] to-transparent border border-purple-500/20 shadow-xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 text-left"
                            >
                                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">videocam</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">Start Next Session</p>
                                    <p className="text-xs text-slate-500">Alex Morgan - 9:00 AM</p>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 text-left"
                            >
                                <div className="size-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-400">event_available</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">View Availability</p>
                                    <p className="text-xs text-slate-500">Manage your slots</p>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 text-left"
                            >
                                <div className="size-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-yellow-400">notifications</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">Send Reminders</p>
                                    <p className="text-xs text-slate-500">Notify upcoming patients</p>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

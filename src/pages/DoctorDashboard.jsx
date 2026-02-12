import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import PatientList from '../components/dashboard/PatientList';
import GlassSidebar from '../components/dashboard/GlassSidebar';
import WelcomeHero from '../components/dashboard/WelcomeHero';

import PatientsView from '../components/dashboard/doctor/PatientsView';
import ScheduleView from '../components/dashboard/doctor/ScheduleView';
import ReportsView from '../components/dashboard/doctor/ReportsView';
import MessagesView from '../components/dashboard/doctor/MessagesView';
import ActivityFeed from '../components/dashboard/doctor/ActivityFeed';
import AppointmentRequests from '../components/dashboard/doctor/AppointmentRequests';

import { useAuthStore } from '../store/useAuthStore';

// 3D Tilt Stat Card Component
function StatCard3D({ stat, index }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 400, damping: 30 });

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

    const isPositive = stat.trend === "up";

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.03, z: 20 }}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Shine Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.1), transparent 50%)`
                    }}
                />

                {/* Content */}
                <div className="relative z-20" style={{ transform: 'translateZ(30px)' }}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">{stat.label}</p>

                    <div className="flex items-end justify-between mb-2">
                        <span className="text-5xl font-black text-white">{stat.value}</span>

                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-sm ${isPositive
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                        >
                            <span className="material-symbols-outlined text-base">
                                {isPositive ? 'trending_up' : 'trending_down'}
                            </span>
                            {stat.change}
                        </motion.div>
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </motion.div>
        </motion.div>
    );
}

// 3D Patient Card Component
function PatientCard3D({ patient, onClick, index }) {
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

    const statusColors = {
        'Critical': 'bg-red-500/20 text-red-400 border-red-500/40',
        'Recovering': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        'On Track': 'bg-green-500/20 text-green-400 border-green-500/40'
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative cursor-pointer group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.02, z: 10 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-lg relative overflow-hidden"
            >
                {/* Shine Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.08), transparent 50%)`
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4">
                    {/* Avatar */}
                    <motion.div
                        className="size-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-black text-lg text-black shadow-lg"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        {patient.name[0]}
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">{patient.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{patient.injury}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 mb-0.5">Pain</p>
                            <p className={`font-bold text-sm ${patient.pain >= 7 ? 'text-red-400' : patient.pain >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {patient.pain}/10
                            </p>
                        </div>

                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${statusColors[patient.status]}`}>
                            {patient.status}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const patients = [
        { id: 1, name: "Alex Morgan", injury: "ACL Tear", status: "Critical", pain: 8, compliance: "40%", nextAppt: "10:00 AM" },
        { id: 2, name: "Marcus Johnson", injury: "Rotator Cuff", status: "Recovering", pain: 3, compliance: "92%", nextAppt: "11:30 AM" },
        { id: 3, name: "Sarah Connor", injury: "Hip Replacement", status: "On Track", pain: 2, compliance: "88%", nextAppt: "2:00 PM" },
        { id: 4, name: "David Kim", injury: "Ankle Sprain", status: "Recovering", pain: 4, compliance: "75%", nextAppt: "Tomorrow" },
        { id: 5, name: "Emily Blunt", injury: "Lower Back", status: "Critical", pain: 7, compliance: "55%", nextAppt: "Urgent" },
    ];

    const stats = [
        { label: "Total Patients", value: "42", change: "+4", trend: "up" },
        { label: "Critical Alerts", value: "3", change: "-1", trend: "down" },
        { label: "Completion Rate", value: "87%", change: "+2%", trend: "up" },
        { label: "Hours Logged", value: "128h", change: "+12h", trend: "up" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'patients': return <PatientsView patients={patients} />;
            case 'schedule': return <ScheduleView patients={patients} />;
            case 'reports': return <ReportsView />;
            case 'messages': return <MessagesView />;
            case 'overview':
            default:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Welcome Hero */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-[#1a1d24] to-transparent border border-primary/20 p-8 overflow-hidden"
                        >
                            {/* Animated Background Orb */}
                            <motion.div
                                className="absolute -top-20 -right-20 size-60 bg-primary/20 rounded-full blur-3xl"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 10, repeat: Infinity }}
                            />

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                        Welcome back, {user?.name || "Doctor"} 👋
                                    </h1>
                                    <p className="text-slate-400">Here's what's happening with your patients today.</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(8, 232, 222, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/tele-doctor')}
                                    className="px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30"
                                >
                                    <span className="material-symbols-outlined">videocam</span>
                                    Start Session
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* KPI Stats with 3D Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <StatCard3D key={index} stat={stat} index={index} />
                            ))}
                        </div>

                        {/* Main Dashboard Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                            {/* Left Column (Patient List) */}
                            <div className="xl:col-span-3 space-y-8">
                                {/* Activity Feed & Appointment Requests */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ActivityFeed />
                                    <AppointmentRequests />
                                </div>

                                {/* Patient List with 3D Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-white mb-1">Active Patients</h3>
                                            <p className="text-xs text-slate-500">Today's priority cases</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab('patients')}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-primary hover:bg-white/10 transition-all"
                                        >
                                            View All →
                                        </motion.button>
                                    </div>

                                    <div className="space-y-3">
                                        {patients.map((patient, index) => (
                                            <PatientCard3D
                                                key={patient.id}
                                                patient={patient}
                                                onClick={() => navigate('/tele-doctor')}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column (Sidebar Widgets) */}
                            <div className="space-y-6">
                                {/* Urgent Alert Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative rounded-3xl bg-gradient-to-br from-red-500/20 via-[#1a1d24] to-transparent border border-red-500/30 p-6 overflow-hidden group hover:from-red-500/25 transition-colors"
                                >
                                    {/* Animated Warning Icon */}
                                    <motion.div
                                        className="absolute top-0 right-0 p-4 text-red-500/50"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <span className="material-symbols-outlined text-6xl">warning</span>
                                    </motion.div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3 text-red-400 font-bold">
                                            <motion.span
                                                className="material-symbols-outlined"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                notifications_active
                                            </motion.span>
                                            <h3>Urgent Alert</h3>
                                        </div>

                                        <p className="text-sm text-white mb-4 pr-12">
                                            <strong className="text-red-300">Alex Morgan</strong> reported Severe Pain (8/10) during Squats 10 mins ago.
                                        </p>

                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={() => navigate('/tele-doctor')}
                                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg"
                                            >
                                                Call Now
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex-1 bg-white/5 border border-red-500/50 hover:bg-red-500/10 text-red-400 font-bold py-2.5 rounded-xl text-sm transition-all"
                                            >
                                                Dismiss
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Today's Schedule */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-5">
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-1">Today's Schedule</h3>
                                            <p className="text-xs text-slate-500">3 appointments</p>
                                        </div>
                                        <motion.button
                                            onClick={() => setActiveTab('schedule')}
                                            whileHover={{ scale: 1.05 }}
                                            className="text-xs text-primary font-bold hover:underline"
                                        >
                                            View Calendar
                                        </motion.button>
                                    </div>

                                    <div className="space-y-4">
                                        {patients.filter(p => p.nextAppt.includes('AM') || p.nextAppt.includes('PM')).map((p, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + i * 0.05 }}
                                                className="flex gap-4 items-center group relative pl-4 border-l-2 border-white/10 hover:border-primary transition-colors p-2 rounded-r-xl hover:bg-white/5"
                                            >
                                                <div className="min-w-[65px]">
                                                    <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg text-center border border-primary/20">
                                                        {p.nextAppt}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-white mb-0.5">{p.name}</h4>
                                                    <p className="text-xs text-slate-500">{p.injury} • Video Consult</p>
                                                </div>

                                                <motion.button
                                                    onClick={() => navigate('/tele-doctor')}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="size-9 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">videocam</span>
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Quick Stats Mini Widget */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-[#1a1d24] to-transparent border border-purple-500/20 shadow-xl"
                                >
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-400">insights</span>
                                        This Week
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-400">Sessions Completed</span>
                                            <span className="font-bold text-white">24</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '75%' }}
                                                transition={{ delay: 0.8, duration: 1 }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-slate-400">Avg. Pain Reduction</span>
                                            <span className="font-bold text-green-400">-2.3</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '85%' }}
                                                transition={{ delay: 0.9, duration: 1 }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0e12] text-white font-sans overflow-hidden selection:bg-primary/30">
            <GlassSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

                    <motion.div
                        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[150px]"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                {/* Premium Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10 border-b border-white/5 bg-gradient-to-b from-[#0a0e12] to-transparent backdrop-blur-xl">
                    <div className="flex-1">
                        <div className="relative w-80 group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Search patients, reports..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-20 py-3 text-sm text-slate-300 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 backdrop-blur-xl"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-600 bg-white/5 border border-white/10 rounded px-2 py-1 font-mono">Ctrl</span>
                                <span className="text-[10px] text-slate-600 bg-white/5 border border-white/10 rounded px-2 py-1 font-mono">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <span className="material-symbols-outlined">mail</span>
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#0a0e12]" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            <motion.span
                                className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#0a0e12]"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button>

                        <div className="h-8 w-px bg-white/10" />

                        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-2xl pr-4 transition-colors">
                            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-black shadow-lg shadow-primary/20">
                                {user?.name?.[0] || "D"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold leading-none">{user?.name || "Dr. User"}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-green-400 leading-none font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 pt-6 scroll-smooth relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import PatientGlassSidebar from '../components/dashboard/PatientGlassSidebar';

// Mock Data
const ROM_DATA = [
    { name: 'Wk 1', angle: 45, target: 125 },
    { name: 'Wk 2', angle: 60, target: 125 },
    { name: 'Wk 3', angle: 75, target: 125 },
    { name: 'Wk 4', angle: 85, target: 125 },
    { name: 'Wk 5', angle: 95, target: 125 },
    { name: 'Wk 6', angle: 110, target: 125 },
    { name: 'Today', angle: 115, target: 125 },
];

const MUSCLE_DATA = [
    { subject: 'Quads', A: 120, fullMark: 150 },
    { subject: 'Hamstrings', A: 98, fullMark: 150 },
    { subject: 'Glutes', A: 86, fullMark: 150 },
    { subject: 'Calves', A: 99, fullMark: 150 },
    { subject: 'Core', A: 85, fullMark: 150 },
    { subject: 'Hip Flexors', A: 65, fullMark: 150 },
];

const WEEKLY_ACTIVITY = [
    { day: 'Mon', reps: 45, accuracy: 92 },
    { day: 'Tue', reps: 52, accuracy: 95 },
    { day: 'Wed', reps: 38, accuracy: 89 },
    { day: 'Thu', reps: 61, accuracy: 96 },
    { day: 'Fri', reps: 48, accuracy: 93 },
    { day: 'Sat', reps: 55, accuracy: 94 },
    { day: 'Sun', reps: 42, accuracy: 91 },
];

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

                {/* Background Icon */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" style={{ transform: 'translateZ(5px)' }}>
                    <span className={`material-symbols-outlined text-7xl ${stat.color}`}>{stat.icon}</span>
                </div>

                {/* Content */}
                <div className="relative z-20" style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="material-symbols-outlined text-xl text-white">{stat.icon}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>

                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl font-black text-white">{stat.value}</span>
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                            className={`text-sm font-bold px-2.5 py-1 rounded-lg mb-2 ${stat.trend.startsWith('+')
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                        >
                            {stat.trend}
                        </motion.span>
                    </div>

                    <p className="text-xs text-slate-500">{stat.subtitle}</p>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity blur-xl`} />
            </motion.div>
        </motion.div>
    );
}

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black/90 backdrop-blur-xl border border-primary/50 p-4 rounded-2xl shadow-2xl"
            >
                <p className="text-slate-400 text-xs mb-2 font-bold">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500">{entry.name}:</span>
                        <span className="text-primary font-bold text-lg">{entry.value}°</span>
                    </div>
                ))}
            </motion.div>
        );
    }
    return null;
};

// Animated Number Counter
function AnimatedNumber({ value, suffix = '', className = '' }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
            className={className}
        >
            {value}{suffix}
        </motion.span>
    );
}

export default function ProgressAnalytics() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [activeChart, setActiveChart] = useState('rom');

    const stats = [
        {
            label: 'Total Reps',
            value: '1,240',
            trend: '+12%',
            icon: 'fitness_center',
            color: 'text-primary',
            gradient: 'from-primary to-cyan-400',
            subtitle: 'This month'
        },
        {
            label: 'Avg Accuracy',
            value: '94%',
            trend: '+3%',
            icon: 'verified',
            color: 'text-purple-400',
            gradient: 'from-purple-500 to-pink-500',
            subtitle: 'AI-validated'
        },
        {
            label: 'Recovery Score',
            value: '8.5',
            trend: '+1.2',
            icon: 'vital_signs',
            color: 'text-green-400',
            gradient: 'from-green-500 to-emerald-400',
            subtitle: 'Out of 10'
        },
        {
            label: 'Consistency',
            value: '89%',
            trend: '+5%',
            icon: 'calendar_today',
            color: 'text-orange-400',
            gradient: 'from-orange-500 to-amber-400',
            subtitle: 'Weekly avg'
        }
    ];

    return (
        <div className="flex h-screen w-full bg-[#0a0e12] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Noise Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

                    {/* Animated floating orbs */}
                    <motion.div
                        className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -40, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]"
                        animate={{
                            x: [0, -50, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                {/* Premium Header */}
                <div className="relative z-10 px-8 pt-6 pb-6 border-b border-white/5 bg-gradient-to-b from-[#0a0e12] to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            {/* Title Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <motion.div
                                    className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <span className="material-symbols-outlined text-3xl text-white font-bold">monitoring</span>
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-1">
                                        Recovery Analytics
                                    </h1>
                                    <p className="text-sm text-slate-500">Real-time biomechanics & progress tracking</p>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                className="flex gap-3"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {/* Period Selector */}
                                <div className="flex gap-2 bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
                                    {['7d', '30d', '90d'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => setSelectedPeriod(period)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedPeriod === period
                                                    ? 'bg-primary text-black'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-cyan-400 text-black text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Export Report
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* 3D Stat Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <StatCard3D key={index} stat={stat} index={index} />
                            ))}
                        </div>

                        {/* Main Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* ROM Area Chart - Enhanced */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl relative group overflow-hidden"
                            >
                                {/* Glass reflection */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-black text-white mb-1">Range of Motion (ROM)</h3>
                                        <p className="text-xs text-slate-500">Right Knee Extension Progress</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1">
                                            <AnimatedNumber value="115" className="text-4xl font-black text-primary" />
                                            <span className="text-lg text-primary">°</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">TARGET: 125°</p>
                                        <div className="mt-2 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '92%' }}
                                                transition={{ delay: 0.5, duration: 1 }}
                                                className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[320px] w-full relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={ROM_DATA}>
                                            <defs>
                                                <linearGradient id="colorAngle" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#08e8de" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#08e8de" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                domain={[0, 140]}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#08e8de', strokeWidth: 2, strokeDasharray: '5 5' }} />
                                            <Area
                                                type="monotone"
                                                dataKey="target"
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                fillOpacity={1}
                                                fill="url(#colorTarget)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="angle"
                                                stroke="#08e8de"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorAngle)"
                                                dot={{ fill: '#08e8de', r: 5, strokeWidth: 2, stroke: '#0a0e12' }}
                                                activeDot={{ r: 7, fill: '#08e8de', stroke: '#0a0e12', strokeWidth: 3 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Muscle Balance Radar */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="mb-4 relative z-10">
                                    <h3 className="text-xl font-black text-white mb-1">Muscle Balance</h3>
                                    <p className="text-xs text-slate-500">Activation Symmetry</p>
                                </div>

                                <div className="h-[320px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={MUSCLE_DATA}>
                                            <PolarGrid stroke="#2a2d35" strokeWidth={1.5} />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Activation"
                                                dataKey="A"
                                                stroke="#8b5cf6"
                                                strokeWidth={3}
                                                fill="#8b5cf6"
                                                fillOpacity={0.3}
                                                dot={{ fill: '#8b5cf6', r: 4 }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>

                                    {/* Warning Badge */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-red-500/20 border border-red-500/40 rounded-full px-4 py-2 backdrop-blur-xl">
                                            <p className="text-[10px] text-red-300 font-bold">
                                                ⚠ Weak: <span className="text-red-400">Hip Flexors</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Weekly Activity Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Weekly Activity</h3>
                                    <p className="text-xs text-slate-500">Daily reps performance</p>
                                </div>

                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-primary" />
                                        <span className="text-slate-400">Reps</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-purple-500" />
                                        <span className="text-slate-400">Accuracy</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[280px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={WEEKLY_ACTIVITY}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0a0e12',
                                                border: '1px solid rgba(8, 232, 222, 0.3)',
                                                borderRadius: '16px',
                                                padding: '12px'
                                            }}
                                            cursor={{ fill: 'rgba(8, 232, 222, 0.05)' }}
                                        />
                                        <Bar dataKey="reps" fill="#08e8de" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="accuracy" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* AI Insight Card - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="rounded-3xl bg-gradient-to-r from-primary/15 via-[#1a1d24] to-transparent border border-primary/30 p-8 relative overflow-hidden group"
                        >
                            {/* Animated top border */}
                            <motion.div
                                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary"
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                            />

                            {/* Glow orb */}
                            <div className="absolute -top-20 -left-20 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-start gap-5">
                                    <motion.div
                                        className="shrink-0 p-4 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl shadow-lg shadow-primary/40"
                                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <span className="material-symbols-outlined text-4xl text-black">psychology</span>
                                    </motion.div>

                                    <div>
                                        <h3 className="text-white text-2xl font-black mb-2 flex items-center gap-2">
                                            AI Recovery Insight
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">BETA</span>
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                                            Your ROM has increased by <span className="text-primary font-bold">15%</span> this week! However, we detected compensation in your left hip. We recommend adding <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-2 cursor-pointer hover:text-primary transition-colors">Clamshells</span> to your routine.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(8, 232, 222, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="shrink-0 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3 text-sm font-bold text-white transition-all whitespace-nowrap backdrop-blur-xl"
                                >
                                    Update Routine →
                                </motion.button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}

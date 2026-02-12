import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// 3D Stat Card Component
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
            transition={{ delay: index * 0.08, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.03, z: 15 }}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Icon Background */}
                <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className={`material-symbols-outlined text-6xl ${stat.color}`}>{stat.icon}</span>
                </div>

                {/* Shine Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.1), transparent 50%)`
                    }}
                />

                <div className="relative z-20" style={{ transform: 'translateZ(20px)' }}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">{stat.label}</p>
                    <div className="flex items-end justify-between">
                        <span className={`text-5xl font-black ${stat.color || 'text-white'}`}>{stat.value}</span>
                        {stat.trend && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
                                className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {stat.trend > 0 ? '+' : ''}{stat.trend}%
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// 3D Patient Card Component with Enhanced Details
function PatientCard3D({ patient, onClick, index, onQuickAction }) {
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

    const statusColors = {
        'Critical': 'bg-red-500/20 text-red-400 border-red-500/40',
        'Recovering': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        'On Track': 'bg-green-500/20 text-green-400 border-green-500/40'
    };

    const compliancePercentage = parseInt(patient.compliance);
    const complianceColor = compliancePercentage >= 80 ? 'text-green-400' : compliancePercentage >= 60 ? 'text-yellow-400' : 'text-red-400';

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.015, z: 10 }}
                onClick={onClick}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-xl relative overflow-hidden"
            >
                {/* Shine Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.08), transparent 50%)`
                    }}
                />

                <div className="relative z-10 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="size-14 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-black text-xl text-black shadow-lg"
                            style={{ transform: 'translateZ(15px)' }}
                        >
                            {patient.name[0]}
                        </motion.div>

                        <div className="flex-1">
                            <h4 className="font-bold text-white text-base mb-1 group-hover:text-primary transition-colors">
                                {patient.name}
                            </h4>
                            <p className="text-xs text-slate-500">{patient.injury}</p>
                        </div>

                        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${statusColors[patient.status]}`}>
                            {patient.status}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Pain Level</p>
                            <p className={`font-black text-lg ${patient.pain >= 7 ? 'text-red-400' : patient.pain >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {patient.pain}/10
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Compliance</p>
                            <p className={`font-black text-lg ${complianceColor}`}>
                                {patient.compliance}
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Next Appt</p>
                            <p className="font-bold text-xs text-primary truncate">
                                {patient.nextAppt}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onQuickAction(patient, 'call'); }}
                            className="flex-1 py-2.5 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">videocam</span>
                            Call Now
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onQuickAction(patient, 'message'); }}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl text-white">chat</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); }}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl text-white">more_vert</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Patient Detail Modal
function PatientDetailModal({ patient, onClose }) {
    if (!patient) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-black text-2xl text-black shadow-lg">
                            {patient.name[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1">{patient.name}</h2>
                            <p className="text-slate-400 text-sm">{patient.injury}</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-2xl text-white">close</span>
                    </motion.button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Pain Level</p>
                        <p className={`text-3xl font-black ${patient.pain >= 7 ? 'text-red-400' : patient.pain >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {patient.pain}/10
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Compliance</p>
                        <p className="text-3xl font-black text-primary">{patient.compliance}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Next Appointment</p>
                        <p className="text-lg font-bold text-white">{patient.nextAppt}</p>
                    </div>
                </div>

                {/* Recovery Progress Chart */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recovery Progress</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Range of Motion</span>
                                <span className="text-primary font-bold">78%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '78%' }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-primary to-cyan-400"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Strength</span>
                                <span className="text-purple-400 font-bold">65%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Exercise Completion</span>
                                <span className="text-green-400 font-bold">{patient.compliance}</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: patient.compliance }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">Completed Knee Extension Set</p>
                                <p className="text-xs text-slate-500">2 hours ago • 3 sets of 15 reps</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="size-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-sm text-yellow-400">warning</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">Reported Pain During Squats</p>
                                <p className="text-xs text-slate-500">5 hours ago • Pain level 8/10</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-sm text-primary">videocam</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">Video Consultation</p>
                                <p className="text-xs text-slate-500">Yesterday • 30 min session</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span className="material-symbols-outlined">videocam</span>
                        Start Video Call
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-white"
                    >
                        View Full History
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function PatientsView({ patients }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [selectedPatient, setSelectedPatient] = useState(null);

    const stats = [
        { label: 'Total Patients', value: patients.length, icon: 'groups', color: 'text-primary', trend: 8 },
        { label: 'Critical Attention', value: patients.filter(p => p.status === 'Critical').length, icon: 'warning', color: 'text-red-400', trend: -15 },
        { label: 'On Track', value: patients.filter(p => p.status === 'On Track').length, icon: 'trending_up', color: 'text-green-400', trend: 12 },
        { label: 'Avg Compliance', value: '82%', icon: 'task_alt', color: 'text-purple-400', trend: 5 }
    ];

    const statusOptions = ['All', 'Critical', 'Recovering', 'On Track'];

    const filteredPatients = patients
        .filter(p => filterStatus === 'All' || p.status === filterStatus)
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.injury.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'pain') return b.pain - a.pain;
            if (sortBy === 'compliance') return parseInt(b.compliance) - parseInt(a.compliance);
            return 0;
        });

    const handleQuickAction = (patient, action) => {
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
                    <h2 className="text-3xl font-black text-white mb-1">Patient Management</h2>
                    <p className="text-slate-400 text-sm">Manage and monitor all your patients</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(8, 232, 222, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Add Patient
                </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard3D key={index} stat={stat} index={index} />
                ))}
            </div>

            {/* Filters and Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-xl"
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search patients by name or injury..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {statusOptions.map((status) => (
                            <motion.button
                                key={status}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${filterStatus === status
                                        ? 'bg-gradient-to-r from-primary to-cyan-400 text-black shadow-lg shadow-primary/30'
                                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {status}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="pain">Sort by Pain Level</option>
                        <option value="compliance">Sort by Compliance</option>
                    </select>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-slate-400">
                    Showing <span className="text-primary font-bold">{filteredPatients.length}</span> of {patients.length} patients
                </div>
            </motion.div>

            {/* Patient Cards Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredPatients.map((patient, index) => (
                        <PatientCard3D
                            key={patient.id}
                            patient={patient}
                            onClick={() => setSelectedPatient(patient)}
                            onQuickAction={handleQuickAction}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredPatients.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                >
                    <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-5xl text-slate-600">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Patients Found</h3>
                    <p className="text-slate-400">Try adjusting your search or filters</p>
                </motion.div>
            )}

            {/* Patient Detail Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailModal
                        patient={selectedPatient}
                        onClose={() => setSelectedPatient(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

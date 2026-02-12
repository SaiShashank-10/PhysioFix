import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BodyStatusModal({ isOpen, onClose, bodyPart, statusData }) {
    if (!isOpen || !bodyPart) return null;

    // Advanced Data Mock with more Physio-relevant fields
    const data = statusData || {
        status: 'Recovering',
        score: 85,
        painTrend: [3, 4, 3, 2, 2, 1, 1],
        lastSession: '2 days ago',
        notes: 'Mild inflammation detected post-workout. Inflammation subsiding. Range of Motion (ROM) is improving steadily.',
        metrics: {
            rom: 92,
            strength: 88,
            stability: 75,
            flexibility: 82,
            endurance: 70
        },
        strain: "Low",
        recommendation: "Continue stretching exercises. Avoid high-impact activities for 3 more days."
    };

    const getStatusColor = (s) => {
        if (s === 'Recovered') return { text: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', glow: 'shadow-green-500/20' };
        if (s === 'Recovering') return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' };
        if (s === 'Strained') return { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
        return { text: 'text-slate-400', bg: 'bg-slate-500/15', border: 'border-slate-500/30', glow: '' };
    };

    const statusStyle = getStatusColor(data.status);

    const getScoreColor = (score) => {
        if (score >= 90) return 'from-green-500 to-emerald-400';
        if (score >= 70) return 'from-amber-500 to-yellow-400';
        return 'from-red-500 to-orange-400';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="fixed inset-0 m-auto w-full max-w-xl h-fit max-h-[90vh] overflow-hidden bg-gradient-to-b from-[#0d1318] to-[#080b0e] rounded-3xl shadow-2xl border border-white/10 z-50"
                    >
                        {/* Premium Header with 3D effect */}
                        <div className="relative h-40 overflow-hidden">
                            {/* Animated gradient background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/30 via-cyan-600/20 to-purple-600/20"
                                animate={{
                                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: 'linear-gradient(rgba(8,232,222,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(8,232,222,0.1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }} />

                            {/* Floating orbs */}
                            <motion.div
                                className="absolute -top-10 -right-10 size-32 bg-primary/30 rounded-full blur-3xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -bottom-5 -left-5 size-24 bg-purple-500/30 rounded-full blur-2xl"
                                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            {/* Close button */}
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors backdrop-blur-md border border-white/10"
                            >
                                <span className="material-symbols-outlined text-white text-lg">close</span>
                            </motion.button>

                            {/* Body part icon with glow */}
                            <motion.div
                                className="absolute -bottom-8 left-6 size-20 bg-gradient-to-br from-[#0d1318] to-[#151d24] rounded-2xl shadow-xl border border-white/10 flex items-center justify-center"
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', delay: 0.1 }}
                            >
                                <span className="material-symbols-outlined text-primary text-4xl">accessibility_new</span>
                                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl"></div>
                            </motion.div>
                        </div>

                        {/* Content */}
                        <motion.div
                            className="px-6 pb-6 pt-14"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Title Row */}
                            <motion.div variants={itemVariants} className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white capitalize mb-1">{bodyPart}</h2>
                                    <p className="text-sm text-slate-500">Biomechanical Analysis Report</p>
                                </div>
                                <motion.div
                                    className={`px-4 py-2 rounded-xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text} shadow-lg ${statusStyle.glow}`}
                                    animate={{ boxShadow: ['0 0 0px', '0 0 20px', '0 0 0px'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <motion.span
                                            className="size-2 rounded-full bg-current"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                        {data.status}
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* Health Score - Large circular display */}
                            <motion.div variants={itemVariants} className="flex justify-center mb-6">
                                <div className="relative">
                                    {/* Outer glow ring */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreColor(data.score)} blur-xl opacity-30`}
                                        animate={{ scale: [0.9, 1.1, 0.9] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />

                                    {/* Score circle */}
                                    <div className="relative size-28 rounded-full bg-gradient-to-br from-[#151d24] to-[#0d1318] border border-white/10 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black bg-gradient-to-r ${getScoreColor(data.score)} bg-clip-text text-transparent`}>
                                            {data.score}
                                        </span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Health Score</span>

                                        {/* Animated ring */}
                                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                            <motion.circle
                                                cx="50" cy="50" r="46"
                                                fill="none"
                                                stroke="url(#scoreGradient)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: data.score / 100 }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                                style={{ strokeDasharray: '1', strokeDashoffset: '0' }}
                                            />
                                            <defs>
                                                <linearGradient id="scoreGradient">
                                                    <stop offset="0%" stopColor="#08e8de" />
                                                    <stop offset="100%" stopColor="#10b981" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Core Metrics Grid - 5 metrics */}
                            <motion.div variants={itemVariants} className="grid grid-cols-5 gap-2 mb-6">
                                {[
                                    { label: "ROM", val: data.metrics.rom, icon: "refresh" },
                                    { label: "Strength", val: data.metrics.strength, icon: "fitness_center" },
                                    { label: "Stability", val: data.metrics.stability, icon: "balance" },
                                    { label: "Flex", val: data.metrics.flexibility, icon: "gesture" },
                                    { label: "Endure", val: data.metrics.endurance, icon: "timer" },
                                ].map((m, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 text-center transition-all group cursor-default"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                    >
                                        <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-lg mb-1 block transition-colors">{m.icon}</span>
                                        <div className="text-lg font-black text-white">{m.val}<span className="text-xs text-slate-500">%</span></div>
                                        <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{m.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pain Trend Graph - Enhanced */}
                            <motion.div variants={itemVariants} className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-sm">monitoring</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-white">Pain Trend (7 Days)</h4>
                                    </div>
                                    <motion.span
                                        className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <span className="material-symbols-outlined text-xs">trending_down</span>
                                        -14%
                                    </motion.span>
                                </div>
                                <div className="h-20 flex items-end justify-between gap-1.5 px-1">
                                    {data.painTrend.map((val, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 flex flex-col justify-end gap-1 group relative"
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            style={{ transformOrigin: 'bottom' }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                Day {i + 1}: Level {val}
                                            </div>
                                            <motion.div
                                                style={{ height: `${Math.max(val * 15, 8)}%` }}
                                                className={`w-full rounded transition-all duration-300 ${val > 3 ? 'bg-gradient-to-t from-orange-600 to-orange-400' : 'bg-gradient-to-t from-primary to-cyan-400'
                                                    } group-hover:shadow-lg group-hover:shadow-primary/30`}
                                            />
                                            <span className="text-[9px] text-center text-slate-600 mt-1">
                                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* AI Recommendation */}
                            <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary/10 to-cyan-500/5 p-4 rounded-2xl border border-primary/20 flex gap-4 mb-5">
                                <motion.div
                                    className="shrink-0 size-10 bg-primary/20 rounded-xl flex items-center justify-center"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                                </motion.div>
                                <div>
                                    <h4 className="font-bold text-primary text-sm mb-1">AI Recommendation</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {data.recommendation}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Clinical Notes */}
                            <motion.div variants={itemVariants} className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20 flex gap-4 mb-6">
                                <div className="shrink-0 size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                    <span className="material-symbols-outlined text-lg">medical_services</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-blue-300 text-sm">Physio Notes</h4>
                                        <span className="text-[10px] text-blue-500/60">Last updated: {data.lastSession}</span>
                                    </div>
                                    <p className="text-xs text-blue-200/70 leading-relaxed">
                                        {data.notes}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/workout"
                                    state={{ exerciseId: 'auto', bodyPart: bodyPart }}
                                    className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-primary to-cyan-500 text-black rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all group"
                                >
                                    <motion.span
                                        className="material-symbols-outlined text-lg"
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        play_arrow
                                    </motion.span>
                                    Start Rehab
                                </Link>

                                <button className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm border border-white/10 hover:border-white/20 transition-all">
                                    <span className="material-symbols-outlined text-lg">edit_note</span>
                                    Log Update
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

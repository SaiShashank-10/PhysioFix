import React from 'react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

export default function StatsOverview({ stats }) {
    // Default stats if none provided
    const displayStats = stats || [
        { label: "Total Patients", value: "0", change: "0", trend: "flat" },
        { label: "Critical Alerts", value: "0", change: "0", trend: "flat" },
        { label: "Completion Rate", value: "0%", change: "0%", trend: "flat" },
        { label: "Hours Logged", value: "0h", change: "0h", trend: "flat" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, i) => (
                <DashboardCard key={i} className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 hover:border-primary/30 transition-all group overflow-hidden relative" delay={i * 0.1}>
                    {/* Hover Glow */}
                    <div className="absolute -right-10 -top-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center justify-between">
                        {stat.label}
                        <span className="material-symbols-outlined text-base opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                            {i === 0 ? 'groups' : i === 1 ? 'warning' : i === 2 ? 'task_alt' : 'schedule'}
                        </span>
                    </p>

                    <div className="flex items-end justify-between relative z-10">
                        <div className="flex flex-col">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="text-3xl font-bold font-sans text-white group-hover:scale-105 transition-transform origin-left"
                            >
                                {stat.value}
                            </motion.h3>
                        </div>

                        <div className="flex flex-col items-end">
                            {/* Animated SVG Sparkline */}
                            <svg width="60" height="20" className="opacity-50 group-hover:opacity-100 transition-opacity mb-1">
                                <motion.path
                                    d={stat.trend === 'up' ? "M0 20 C 20 20, 40 0, 60 5" : "M0 5 C 20 0, 40 20, 60 20"}
                                    fill="none"
                                    stroke={stat.trend === 'up' ? '#4ade80' : '#f87171'}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </svg>

                            <span className={`text - [10px] font - bold px - 1.5 py - 0.5 rounded border ${stat.trend === 'up' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                                stat.trend === 'down' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-slate-400 border-slate-500/20'
                                } `}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                </DashboardCard>
            ))}
        </div>
    );
}

import React from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '../DashboardCard';

export default function ActivityFeed() {
    const activities = [
        { id: 1, user: "Alex Morgan", action: "completed session", detail: "ACL Rehab - Day 4", time: "10m ago", icon: "fitness_center", color: "text-blue-400" },
        { id: 2, user: "Sarah Connor", action: "logged pain score", detail: "Left Knee: 4/10", time: "30m ago", icon: "sentiment_dissatisfied", color: "text-orange-400" },
        { id: 3, user: "Marcus Johnson", action: "sent a message", detail: "\"Rescheduling tomorrow?\"", time: "1h ago", icon: "chat", color: "text-primary" },
        { id: 4, user: "System", action: "generated report", detail: "Weekly Summary Available", time: "2h ago", icon: "description", color: "text-purple-400" },
    ];

    return (
        <DashboardCard className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-white">Recent Activity</h3>
                <button className="text-xs text-slate-400 hover:text-white transition-colors">View All</button>
            </div>

            <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/5 rounded-full"></div>

                {activities.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 relative"
                    >
                        <div className={`relative z-10 size-10 rounded-full bg-[#18191d] border border-white/10 flex items-center justify-center shrink-0 ${item.color}`}>
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-white">
                                    <span className="font-bold hover:underline cursor-pointer">{item.user}</span> {item.action}
                                </p>
                                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardCard>
    );
}

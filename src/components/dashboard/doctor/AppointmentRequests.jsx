import React from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '../DashboardCard';

export default function AppointmentRequests() {
    const requests = [
        { id: 1, name: "Emily Blunt", type: "New Assessment", time: "Tomorrow, 2:00 PM", avatar: "https://ui-avatars.com/api/?name=Emily+Blunt" },
        { id: 2, name: "John Wick", type: "Follow-up", time: "Wed, 10:00 AM", avatar: "https://ui-avatars.com/api/?name=John+Wick" },
    ];

    return (
        <DashboardCard className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    Requests
                    <span className="bg-primary text-[#0f1014] text-[10px] font-bold px-1.5 py-0.5 rounded-full">{requests.length}</span>
                </h3>
            </div>

            <div className="space-y-4">
                {requests.map((req, i) => (
                    <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-center group hover:border-white/10 transition-colors"
                    >
                        <img src={req.avatar} alt={req.name} className="size-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white truncate">{req.name}</h4>
                            <p className="text-xs text-slate-400 truncate">{req.type} • {req.time}</p>
                        </div>
                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="size-8 rounded-lg hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-lg">check</span>
                            </button>
                            <button className="size-8 rounded-lg hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 border border-dashed border-white/10 hover:border-primary/50 text-slate-500 hover:text-primary rounded-lg text-xs font-bold transition-colors">
                View Calendar
            </button>
        </DashboardCard>
    );
}

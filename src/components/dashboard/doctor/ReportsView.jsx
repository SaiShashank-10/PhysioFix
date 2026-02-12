import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '../DashboardCard';

export default function ReportsView() {
    const recoveryData = [
        { day: 'Mon', active: 40, passive: 24 },
        { day: 'Tue', active: 60, passive: 38 },
        { day: 'Wed', active: 55, passive: 45 },
        { day: 'Thu', active: 80, passive: 50 },
        { day: 'Fri', active: 75, passive: 60 },
        { day: 'Sat', active: 95, passive: 70 },
        { day: 'Sun', active: 90, passive: 75 },
    ];

    const painData = [
        { day: 'Mon', pain: 8 },
        { day: 'Tue', pain: 7 },
        { day: 'Wed', pain: 6 },
        { day: 'Thu', pain: 4 },
        { day: 'Fri', pain: 5 },
        { day: 'Sat', pain: 2 },
        { day: 'Sun', pain: 2 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Clinic Analytics</h2>
                <div className="flex gap-2">
                    <select className="bg-[#18191d] border border-white/10 px-3 py-2 rounded-lg text-sm font-bold text-slate-300 outline-none">
                        <option>This Week</option>
                        <option>Last Month</option>
                    </select>
                    <button className="bg-primary text-[#0f1014] px-4 py-2 rounded-lg text-sm font-bold hover:bg-white flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recovery Trajectory Chart */}
                <DashboardCard className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 h-80">
                    <h3 className="font-bold mb-6 text-white flex items-center justify-between">
                        Patient Recovery Trends
                        <span className="text-xs font-normal text-slate-400">vs Expected</span>
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={recoveryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18191d', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="active" stroke="#05cccc" strokeWidth={3} dot={{ r: 4, fill: '#05cccc' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="passive" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </DashboardCard>

                {/* Pain Analysis Area Chart */}
                <DashboardCard className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 h-80">
                    <h3 className="font-bold mb-6 text-white">Aggregated Pain Levels</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={painData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} domain={[0, 10]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18191d', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <defs>
                                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="pain" stroke="#ef4444" fillOpacity={1} fill="url(#painGradient)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Satisfaction Rate", value: "92%", footer: "Based on 124 reviews", color: "border-green-500", text: "text-green-500" },
                    { label: "Recovery Efficacy", value: "85%", footer: "Patients hitting goals", color: "border-blue-500", text: "text-blue-500" },
                    { label: "Churn Rate", value: "3%", footer: "Down from 5% last month", color: "border-purple-500", text: "text-purple-500" },
                ].map((kpi, i) => (
                    <DashboardCard key={i} className="bg-[#18191d]/60 backdrop-blur-md border border-white/5 p-6 flex flex-col items-center justify-center text-center">
                        <div className={`size-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold mb-3 ${kpi.color} ${kpi.text}`}>
                            {kpi.value}
                        </div>
                        <h4 className="font-bold text-lg text-white">{kpi.label}</h4>
                        <p className="text-slate-400 text-xs">{kpi.footer}</p>
                    </DashboardCard>
                ))}
            </div>
        </motion.div>
    );
}

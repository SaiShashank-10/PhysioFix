import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 70 },
    { name: 'Wed', score: 68 },
    { name: 'Thu', score: 75 },
    { name: 'Fri', score: 82 },
    { name: 'Sat', score: 85 },
    { name: 'Sun', score: 88 },
];

export default function RecoveryChart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#05cccc" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#05cccc" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#05cccc', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#05cccc"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

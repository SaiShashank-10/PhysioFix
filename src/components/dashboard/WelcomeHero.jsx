import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WelcomeHero({ user }) {
    const [greeting, setGreeting] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hour = now.getHours();

            if (hour < 12) setGreeting('Good Morning');
            else if (hour < 18) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');

            setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-48 rounded-3xl overflow-hidden mb-8 group"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-primary/80 animate-gradient-xy bg-[length:200%_200%]"></div>

            {/* Glass Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -right-20 -top-20 size-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-1000"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-white/80 font-medium mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {date}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{user?.name || "Doctor"}</span>
                    </h1>
                    <p className="text-indigo-100 mt-2 max-w-lg">
                        You have <strong className="text-white">3 urgent alerts</strong> and <strong className="text-white">5 appointments</strong> remaining today.
                    </p>
                </motion.div>

                {/* Quick Action Button */}
                <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-3">
                    <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg">
                        <span className="material-symbols-outlined">add</span>
                        New Patient
                    </button>
                    <button className="bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
                        <span className="material-symbols-outlined">videocam</span>
                        Start Session
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

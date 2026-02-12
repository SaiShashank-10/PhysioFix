import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function HydrationWidget() {
    const [intake, setIntake] = useState(1250); // ml
    const goal = 2500; // ml
    const percentage = Math.min((intake / goal) * 100, 100);

    const addWater = (amount) => {
        setIntake(prev => Math.min(prev + amount, 3500));
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-[#637588] dark:text-[#8ecccc] text-xs font-bold uppercase tracking-wider">Hydration</p>
                    <h3 className="text-2xl font-bold text-[#111418] dark:text-white mt-1">
                        {intake}<span className="text-sm font-normal text-[#637588]">ml</span>
                    </h3>
                    <p className="text-xs text-[#637588] dark:text-[#8ecccc]">Goal: {goal}ml</p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-blue-500 animate-pulse">water_drop</span>
                </div>
            </div>

            {/* Visual Bar with Wave Effect */}
            <div className="relative h-28 w-full bg-[#e2e8f0] dark:bg-[#0f1d1d] rounded-2xl overflow-hidden mb-3 border border-slate-200 dark:border-[#2f6a6a]">
                {/* Background Wave (Darker) */}
                <motion.div
                    animate={{
                        height: [`${percentage - 5}%`, `${percentage + 2}%`, `${percentage - 5}%`],
                        x: [-5, 5, -5]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute bottom-0 left-[-10%] w-[120%] bg-blue-600 opacity-60 rounded-t-[50%]"
                />

                {/* Foreground Wave (Lighter) */}
                <motion.div
                    animate={{
                        height: [`${percentage}%`, `${percentage - 3}%`, `${percentage}%`],
                        x: [5, -5, 5]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute bottom-0 left-[-10%] w-[120%] bg-blue-500 opacity-90 rounded-t-[40%]"
                />

                {/* Percentage Text (Adaptive Color) */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className={`text-xl font-bold transition-colors duration-300 ${percentage > 50 ? 'text-white drop-shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>
                        {Math.round(percentage)}%
                    </span>
                </div>

                {/* Bubbles Animation */}
                {percentage > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                className="absolute bottom-0 bg-white/30 rounded-full"
                                style={{
                                    width: Math.random() * 6 + 4,
                                    height: Math.random() * 6 + 4,
                                    left: `${20 + Math.random() * 60}%`
                                }}
                                animate={{ y: -100, opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => addWater(250)}
                    className="flex-1 py-2 bg-white dark:bg-[#1a3838] border border-slate-200 dark:border-[#2f6a6a] hover:bg-blue-50 dark:hover:bg-[#214a4a] text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm">local_drink</span>
                    +250ml
                </button>
                <button
                    onClick={() => addWater(500)}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-500/20"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    +500ml
                </button>
            </div>
        </div>
    );
}

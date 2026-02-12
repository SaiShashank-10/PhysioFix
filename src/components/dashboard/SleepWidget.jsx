import React from 'react';
import { motion } from 'framer-motion';

export default function SleepWidget() {
    // Mock Data
    const sleepData = {
        total: "7h 20m",
        score: 92,
        stages: {
            deep: 25, // %
            rem: 25,
            light: 45,
            awake: 5
        }
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-[#637588] dark:text-[#8ecccc] text-xs font-bold uppercase tracking-wider">Sleep Recovery</p>
                    <h3 className="text-2xl font-bold text-[#111418] dark:text-white mt-1">
                        {sleepData.total}
                    </h3>
                </div>
                <div className="bg-indigo-500/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-indigo-500">bedtime</span>
                </div>
            </div>

            {/* Sleep Stages Bar */}
            <div className="flex flex-col gap-1 my-1">
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-[#0f1d1d]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${sleepData.stages.deep}%` }} className="h-full bg-indigo-600" title="Deep Sleep" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${sleepData.stages.rem}%` }} transition={{ delay: 0.2 }} className="h-full bg-indigo-400" title="REM" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${sleepData.stages.light}%` }} transition={{ delay: 0.4 }} className="h-full bg-indigo-300/50" title="Light" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${sleepData.stages.awake}%` }} transition={{ delay: 0.6 }} className="h-full bg-orange-300" title="Awake" />
                </div>
                <div className="flex justify-between text-[10px] text-[#637588] px-1">
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-indigo-600"></span>Deep</span>
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-indigo-400"></span>REM</span>
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-indigo-300/50"></span>Light</span>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-1">
                <div className="flex flex-col items-center justify-center size-12 rounded-full border-4 border-indigo-500/20 relative">
                    <span className="text-sm font-bold text-indigo-500">{sleepData.score}</span>
                    <svg className="absolute inset-0 size-full -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-transparent" />
                        <motion.circle
                            cx="24" cy="24" r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-indigo-500"
                            strokeDasharray="125.6"
                            strokeDashoffset={125.6 - (125.6 * sleepData.score) / 100}
                            initial={{ strokeDashoffset: 125.6 }}
                            animate={{ strokeDashoffset: 125.6 - (125.6 * sleepData.score) / 100 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </svg>
                </div>
                <div className="flex-1 text-[10px] p-2 bg-indigo-50 dark:bg-[#151c2f] rounded-lg border border-indigo-100 dark:border-indigo-900/30 text-indigo-900 dark:text-indigo-200 leading-snug">
                    <span className="font-bold">Insight:</span> Optimized REM cycle detected (25%). Neural recovery active.
                </div>
            </div>
        </div>
    );
}

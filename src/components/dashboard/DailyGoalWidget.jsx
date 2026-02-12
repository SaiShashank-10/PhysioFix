import React from 'react';
import { motion } from 'framer-motion';

export default function DailyGoalWidget({ goal = 500, current = 350, className = "" }) {
    const percentage = Math.min((current / goal) * 100, 100);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative flex items-center gap-4 ${className}`}>
            <div className="relative size-16 shrink-0 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="size-full rotate-[-90deg]">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-[#e2e8f0] dark:text-[#214a4a]"
                    />
                    {/* Progress Circle (Animated) */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#111418] dark:text-white">
                        {Math.round(percentage)}%
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <h4 className="font-bold text-[#111418] dark:text-white text-sm">Daily Move Goal</h4>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">{current}</span>
                    <span className="text-xs text-[#637588] dark:text-[#8ecccc]">/ {goal} kcal</span>
                </div>
                <p className="text-[10px] text-[#637588] dark:text-[#cbd5e1] mt-0.5">Keep moving to reach your target!</p>
            </div>
        </div>
    );
}

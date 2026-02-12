// Enhanced BodyMap with Cyberpunk/Medical Aesthetic
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BodyMap({ recoveryStatus, onPartClick, selectedPart, view = 'muscles' }) {
    const [hoveredPart, setHoveredPart] = useState(null);

    // Mock Status if not provided
    const status = recoveryStatus || {
        "shoulders": "recovered",
        "chest": "recovering",
        "abs": "recovered",
        "legs": "strained",
    };

    const getColor = (part) => {
        const s = status[part];
        // Using neon colors for dark mode
        if (s === "recovered") return "#10b981"; // Emerald
        if (s === "recovering") return "#eab308"; // Yellow
        if (s === "strained") return "#ef4444"; // Red
        return "#334155"; // Slate-700
    };

    const handleEnter = (part) => setHoveredPart(part);
    const handleLeave = () => setHoveredPart(null);
    const handleClick = (part) => {
        if (onPartClick) onPartClick(part);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* SVG Body Map */}
            <motion.svg
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewBox="0 0 200 400"
                className="h-full w-auto drop-shadow-[0_0_15px_rgba(5,204,204,0.1)]"
            >
                <defs>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                {/* --- Base Body Silhouette (Simplified) --- */}
                {/* Head */}
                <circle cx="100" cy="30" r="15" fill="#1e293b" stroke="#334155" strokeWidth="1" />

                {/* Shoulders / Arms */}
                <motion.path
                    whileHover={{ scale: 1.02 }}
                    d="M 60 60 Q 100 60 140 60 L 150 150 L 130 150 L 125 70 L 100 70 L 75 70 L 70 150 L 50 150 Z"
                    fill={getColor("shoulders")}
                    stroke={selectedPart === "shoulders" ? "#ffffff" : "transparent"}
                    strokeWidth={selectedPart === "shoulders" ? "2" : "1"}
                    filter={hoveredPart === "shoulders" || selectedPart === "shoulders" ? "url(#neon-glow)" : ""}
                    onMouseEnter={() => handleEnter("shoulders")}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick("shoulders")}
                    className="cursor-pointer transition-colors duration-300"
                    style={{ fillOpacity: 0.8 }}
                />

                {/* Chest */}
                <motion.path
                    whileHover={{ scale: 1.02 }}
                    d="M 75 70 L 125 70 L 120 110 Q 100 120 80 110 Z"
                    fill={getColor("chest")}
                    stroke={selectedPart === "chest" ? "#ffffff" : "transparent"}
                    strokeWidth={selectedPart === "chest" ? "2" : "1"}
                    filter={hoveredPart === "chest" || selectedPart === "chest" ? "url(#neon-glow)" : ""}
                    onMouseEnter={() => handleEnter("chest")}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick("chest")}
                    className="cursor-pointer transition-colors duration-300"
                    style={{ fillOpacity: 0.8 }}
                />

                {/* Abs */}
                <motion.path
                    whileHover={{ scale: 1.02 }}
                    d="M 80 110 Q 100 120 120 110 L 115 160 Q 100 170 85 160 Z"
                    fill={getColor("abs")}
                    stroke={selectedPart === "abs" ? "#ffffff" : "transparent"}
                    strokeWidth={selectedPart === "abs" ? "2" : "1"}
                    filter={hoveredPart === "abs" || selectedPart === "abs" ? "url(#neon-glow)" : ""}
                    onMouseEnter={() => handleEnter("abs")}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick("abs")}
                    className="cursor-pointer transition-colors duration-300"
                    style={{ fillOpacity: 0.8 }}
                />

                {/* Legs */}
                <motion.path
                    whileHover={{ scale: 1.02 }}
                    d="M 85 160 Q 100 170 115 160 L 115 170 L 130 350 L 110 350 L 105 200 L 95 200 L 90 350 L 70 350 L 85 170 Z"
                    fill={getColor("legs")}
                    stroke={selectedPart === "legs" ? "#ffffff" : "transparent"}
                    strokeWidth={selectedPart === "legs" ? "2" : "1"}
                    filter={hoveredPart === "legs" || selectedPart === "legs" ? "url(#neon-glow)" : ""}
                    onMouseEnter={() => handleEnter("legs")}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick("legs")}
                    className="cursor-pointer transition-colors duration-300"
                    style={{ fillOpacity: 0.8 }}
                />
            </motion.svg>

            {/* Tooltip Overlay */}
            <AnimatePresence>
                {hoveredPart && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 right-0 bg-[#0f1014]/90 backdrop-blur-md border border-white/10 text-white text-xs p-3 rounded-xl shadow-xl z-20 pointer-events-none min-w-[120px]"
                    >
                        <p className="font-bold capitalize text-sm mb-1">{hoveredPart}</p>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full" style={{ backgroundColor: getColor(hoveredPart) }}></span>
                            <span className="opacity-80 capitalize">{status[hoveredPart]}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

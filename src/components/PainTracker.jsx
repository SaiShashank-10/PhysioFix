import React, { useState } from 'react';

export default function PainTracker({ onSave }) {
    const [isOpen, setIsOpen] = useState(false);
    const [painLevel, setPainLevel] = useState(0);

    const handleSave = () => {
        if (onSave) onSave({ level: painLevel, timestamp: new Date() });
        setIsOpen(false);
        // Maybe discourage high pain?
        if (painLevel > 5) {
            alert("High pain reported! Please consider stopping or reducing intensity.");
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-20 right-4 bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 group"
                title="Log Pain"
            >
                <span className="material-symbols-outlined text-2xl">healing</span>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 text-sm font-bold">Log Pain</span>
            </button>
        );
    }

    return (
        <div className="absolute top-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl z-50 w-64 border-2 border-red-500 animate-slide-in">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">healing</span>
                Pain Report
            </h3>

            <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>No Pain</span>
                    <span className="text-red-500">Severe</span>
                </div>
                <input
                    type="range"
                    min="0" max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="text-center font-black text-2xl text-red-500 mt-2">{painLevel}</div>
            </div>

            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="flex-1 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Save Log</button>
            </div>
        </div>
    );
}

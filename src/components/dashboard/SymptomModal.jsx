import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SymptomModal({ isOpen, onClose }) {
    const [painLevel, setPainLevel] = useState(2);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save to backend
        console.log("Logged Symptoms:", { painLevel, notes });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#183535] rounded-2xl shadow-2xl border border-[#e5e7eb] dark:border-[#214a4a] overflow-hidden z-[80]"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#111418] dark:text-white">Log Daily Symptoms</h3>
                                <button onClick={onClose} className="text-[#637588] dark:text-[#8ecccc] hover:rotate-90 transition-transform">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Pain Slider */}
                                <div>
                                    <label className="block text-sm font-bold text-[#111418] dark:text-white mb-2">
                                        Current Pain Level: <span className="text-primary text-lg">{painLevel}/10</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={painLevel}
                                        onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-[#e2e8f0] dark:bg-[#102323] rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-xs text-[#637588] dark:text-[#8ecccc] mt-1">
                                        <span>No Pain</span>
                                        <span>Moderate</span>
                                        <span>Severe</span>
                                    </div>
                                </div>

                                {/* Quick Tags (Mock) */}
                                <div>
                                    <label className="block text-sm font-bold text-[#111418] dark:text-white mb-2">Sensations</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Stiff', 'Sore', 'Sharp', 'Throbbing', 'Better'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className="px-3 py-1 rounded-full text-xs font-medium border border-[#e5e7eb] dark:border-[#214a4a] text-[#637588] dark:text-[#cbd5e1] hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors focus:ring-2 focus:ring-primary"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-bold text-[#111418] dark:text-white mb-2">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Describe how you're feeling..."
                                        className="w-full h-24 bg-[#f8fafc] dark:bg-[#102323] rounded-xl p-3 text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary text-[#102323] font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    Save Log
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

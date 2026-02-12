import React from 'react';
import { motion } from 'framer-motion';

export default function FeaturesBento() {
    return (
        <div id="features" className="w-full bg-[#0f1014] py-24 px-6 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Everything needed for <span className="text-primary">Medical-Grade</span> Recovery.</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our computer vision engine tracks 87 skeletal points in real-time, providing feedback previously only possible in a clinic.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Large Card - AI Tracking */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-[#18191d] border border-white/5 p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                                <span className="material-symbols-outlined text-3xl">view_in_ar</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Real-Time Skeletal Tracking</h3>
                            <p className="text-slate-400 max-w-md">Our proprietary CV model runs locally in your browser. No video is ever recorded or sent to a server. Privacy first, always.</p>
                        </div>
                        {/* Visual Decoration */}
                        <div className="absolute right-0 bottom-0 w-64 h-full bg-gradient-to-l from-[#0f1014] to-transparent z-0"></div>
                        <div className="absolute -right-10 -bottom-10 opacity-30 group-hover:opacity-50 transition-opacity">
                            <span className="material-symbols-outlined text-[200px] text-primary">accessibility_new</span>
                        </div>
                    </div>

                    {/* Tall Card - Audio Coach */}
                    <div className="md:col-span-1 row-span-2 rounded-3xl bg-[#18191d] border border-white/5 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="size-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                                <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Active Audio Coach</h3>
                            <p className="text-slate-400 mb-8">Get instant corrections: "Keep your back straight", "Go lower", "Good job!". It's like having a PT in your ear.</p>

                            <div className="flex-1 flex items-center justify-center relative">
                                {/* Audio Wave simulation */}
                                <div className="flex items-end gap-1 h-32">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: ['20%', '80%', '20%'] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                            className="w-4 bg-purple-500 rounded-full opacity-60"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medium Card - Analytics */}
                    <div className="md:col-span-1 border border-white/5 rounded-3xl bg-[#18191d] p-8 hover:border-blue-500/30 transition-colors group">
                        <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                            <span className="material-symbols-outlined text-3xl">monitoring</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Precision Analytics</h3>
                        <p className="text-slate-400 text-sm">Track range of motion (ROM), pain levels, and consistency over weeks.</p>
                    </div>

                    {/* Medium Card - Doctor Connect */}
                    <div className="md:col-span-1 border border-white/5 rounded-3xl bg-[#18191d] p-8 hover:border-green-500/30 transition-colors group">
                        <div className="size-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-6">
                            <span className="material-symbols-outlined text-3xl">medical_services</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Doctor Connected</h3>
                        <p className="text-slate-400 text-sm">Your clinician sees your data instantly. Request video calls with one click.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

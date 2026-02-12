import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroModern() {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0f1014] pt-20">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150"></div>
            </div>

            <div className="layout-content-container flex flex-col lg:flex-row items-center justify-between max-w-[1280px] w-full px-6 md:px-12 z-10 gap-16">

                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-8 max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 w-fit backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-bold text-primary tracking-wide uppercase">AI-Powered Recovery 2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-sans font-black text-white leading-[1.1] tracking-tight">
                        Heal Smarter. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-200 to-white">Recover Faster.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-lg">
                        The world's first medical-grade physical therapy platform powered by computer vision. No wearables. Just you and our AI.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <Link to="/signup" className="relative group overflow-hidden px-8 py-4 rounded-xl bg-primary text-[#0f1014] font-bold text-lg shadow-[0_0_40px_rgba(5,204,204,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(5,204,204,0.6)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Free Assessment
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>

                        <a href="#features" className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined">play_circle</span>
                            Watch Demo
                        </a>
                    </div>

                    <div className="flex items-center gap-4 mt-8 opacity-70">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="size-10 rounded-full border-2 border-[#0f1014] bg-slate-700 bg-cover" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 10}')` }}></div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400">Trusted by <strong className="text-white">10,000+</strong> patients</p>
                    </div>
                </motion.div>

                {/* Right: Abstract 3D / Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full lg:w-1/2"
                >
                    <div className="relative aspect-square md:aspect-[4/3] rounded-3xl border border-white/10 bg-[#18191d]/50 backdrop-blur-xl p-4 shadow-2xl overflow-hidden group">
                        {/* Fake UI Elements */}
                        <div className="absolute top-4 left-4 right-4 h-8 bg-white/5 rounded-full flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="size-2 rounded-full bg-red-500"></div>
                                <div className="size-2 rounded-full bg-yellow-500"></div>
                                <div className="size-2 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/* Main Content - Placeholder for "AI Skeleton" look */}
                        <div className="absolute inset-0 top-16 bg-gradient-to-b from-transparent to-primary/5 flex items-center justify-center">
                            {/* Central Animated Element */}
                            <div className="relative size-64">
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-4 border border-dashed border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-9xl text-primary drop-shadow-[0_0_30px_rgba(5,204,204,0.8)]">accessibility_new</span>
                                </div>

                                {/* Floating Stats */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute -right-12 top-0 bg-[#0f1014]/90 border border-primary/50 p-3 rounded-xl shadow-lg backdrop-blur-md"
                                >
                                    <div className="text-xs text-slate-400">Flexion</div>
                                    <div className="text-xl font-bold text-primary">112°</div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                                    className="absolute -left-12 bottom-0 bg-[#0f1014]/90 border border-green-500/50 p-3 rounded-xl shadow-lg backdrop-blur-md"
                                >
                                    <div className="text-xs text-slate-400">Accuracy</div>
                                    <div className="text-xl font-bold text-green-400">98%</div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

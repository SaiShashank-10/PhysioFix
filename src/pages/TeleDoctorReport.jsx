import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TeleDoctorReport() {
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);
        // Mock export delay
        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <div id="report-content" className="bg-[#0f1014] min-h-screen text-white font-sans selection:bg-primary selection:text-[#0f1014]">
            {/* Top Navigation */}
            <header data-html2canvas-ignore className="flex items-center justify-between px-10 py-4 border-b border-white/5 bg-[#0f1014]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary shadow-[0_0_10px_rgba(5,204,204,0.4)]">
                        <span className="material-symbols-outlined">monitor_heart</span>
                    </div>
                    <h2 className="text-lg font-black tracking-tight">PhysioFix</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-primary/30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5hBM5iMvVk35GwnlqyYvHRIUm5ZoTMuJZRJWo5uIJsAvbQndH5h4nzm79X5UX655736zXbipxQbw5Fv_6jZJTd1dWPyxMTmwVnjvMNXSOKpBdiT-ouY5steMzHDwAEU3uxrj1MJyB7bj4Y6ofRgMYIBPS4DFH0c45_ALhmdnpqiKBsuiXQEisztJelqD6hL4REn9wlTAIOVtcBQeXVqvlZN-E1tZtMDbZq4TmRKpBBgjY9mr-jf0MJ1L539UpKSkW4EZJytd2rlUn")' }}></div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 pb-8 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-3xl text-primary">clinical_notes</span>
                            <h1 className="text-3xl font-black text-white tracking-tight">Clinical Movement Report</h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm">Case ID: #PF-2023-884 • Patient: Alex Morgan • Oct 24, 2023</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportPDF}
                            className="bg-primary hover:bg-primary/90 text-[#0f1014] px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(5,204,204,0.3)]"
                        >
                            {isExporting ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">download</span>}
                            {isExporting ? "Generating..." : "Export PDF"}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Adherence Score', value: '94%', trend: '+5%', icon: 'trending_up', color: 'text-green-400' },
                        { label: 'Sessions Done', value: '12/12', trend: 'Perfect', icon: 'check_circle', color: 'text-primary' },
                        { label: 'Avg Pain Level', value: '2.5', trend: '-1.5', icon: 'healing', color: 'text-orange-400' },
                        { label: 'Recovery Time', value: '4 Wks', trend: 'On Track', icon: 'schedule', color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#18191d]/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-500 text-xs font-bold uppercase">{stat.label}</p>
                                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                                <p className={`text-xs font-bold bg-white/5 px-1.5 py-0.5 rounded ${stat.color}`}>{stat.trend}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ROM Chart */}
                        <div className="bg-[#18191d]/80 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">ssid_chart</span>
                                Range of Motion (ROM) Analysis
                            </h3>

                            {/* CSS Bar Chart for visual simplicity */}
                            <div className="flex items-end justify-between h-48 gap-4 px-4 pb-4 border-b border-white/10 relative z-10">
                                {[45, 60, 75, 95, 110].map((val, i) => (
                                    <div key={i} className="w-full flex flex-col justify-end group cursor-pointer h-full">
                                        <div className="relative w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                            style={{ height: `${(val / 125) * 100}%`, backgroundColor: i === 4 ? '#05cccc' : '#334155' }}>

                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0f1014] text-white text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}°
                                            </div>
                                        </div>
                                        <p className={`text-[10px] text-center mt-2 font-mono ${i === 4 ? 'text-primary font-bold' : 'text-slate-500'}`}>Wk {i + 1}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#18191d]/80 border border-white/5 p-6 rounded-2xl">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm text-slate-400">speed</span>
                                    Movement Velocity
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                                            <span>Flexion Speed</span>
                                            <span className="text-white font-bold">Normal</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[85%] shadow-[0_0_10px_rgba(5,204,204,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                                            <span>Extension Speed</span>
                                            <span className="text-yellow-400 font-bold">Slow</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-yellow-400 h-full rounded-full w-[45%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#18191d]/80 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                <div className="relative size-20 shrink-0">
                                    <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                        <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">88%</div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Stability Index</p>
                                    <p className="text-xs text-slate-400 mb-2">Posture Control</p>
                                    <p className="text-[10px] text-green-400 font-bold bg-green-400/10 inline-block px-1.5 py-0.5 rounded">Good Control</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Sidebar */}
                    <div className="bg-[#18191d]/80 border border-white/5 p-0 rounded-2xl overflow-hidden flex flex-col h-full ring-1 ring-white/5">
                        <div className="p-5 border-b border-white/5 bg-primary/5">
                            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology_alt</span>
                                AI Clinical Analysis
                            </h3>
                        </div>
                        <div className="p-5 flex flex-col gap-6 text-sm flex-grow">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Subjective</h4>
                                <p className="text-slate-300 leading-relaxed text-xs">
                                    Patient reports decreased pain (2/10). Morning stiffness duration reduced to &lt;30 mins. Confidence in ambulation improved.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Objective</h4>
                                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs marker:text-primary">
                                    <li>Right knee extension +5°.</li>
                                    <li>Flexion reached 110° (Goal Met).</li>
                                    <li>Gait symmetry improved (L:48%/R:52%).</li>
                                </ul>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-auto">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">AI Assessment</h4>
                                <p className="text-white font-medium text-xs leading-relaxed">
                                    Recovery is ahead of schedule. Inflammation low. High adherence (94%). Recommend increasing resistance next week.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

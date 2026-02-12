import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BodyStatus3D from '../components/dashboard/BodyStatus3D';
import RecoveryChart from '../components/dashboard/RecoveryChart';
import PatientGlassSidebar from '../components/dashboard/PatientGlassSidebar';
import NotificationDropdown from '../components/dashboard/NotificationDropdown';
import AIChatWidget from '../components/dashboard/AIChatWidget';
import SymptomModal from '../components/dashboard/SymptomModal';
import DailyGoalWidget from '../components/dashboard/DailyGoalWidget';
import BodyStatusModal from '../components/dashboard/BodyStatusModal';
import { useAuthStore } from '../store/useAuthStore';

// ==================== ULTRA PREMIUM 3D COMPONENTS ====================

// Global Mouse Spotlight Effect
const MouseSpotlight = ({ containerRef }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current) {
                const r = containerRef.current.getBoundingClientRect();
                setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
            }
        };
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, [containerRef]);
    return (
        <div className="pointer-events-none fixed inset-0 z-30" style={{
            background: `radial-gradient(800px circle at ${pos.x}px ${pos.y}px, rgba(8,232,222,0.04), transparent 40%)`
        }} />
    );
};

// Ultimate 3D Card with Depth, Glow, Reflection
const Card3D = ({ children, className = '', onClick, glow = 'cyan', depth = 1 }) => {
    const ref = useRef(null);
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
    const [hover, setHover] = useState(false);

    const handleMove = (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };

    const colors = {
        cyan: { glow: 'rgba(8,232,222,0.5)', border: 'rgba(8,232,222,0.3)' },
        green: { glow: 'rgba(34,197,94,0.5)', border: 'rgba(34,197,94,0.3)' },
        yellow: { glow: 'rgba(250,204,21,0.5)', border: 'rgba(250,204,21,0.3)' },
        purple: { glow: 'rgba(168,85,247,0.5)', border: 'rgba(168,85,247,0.3)' },
        blue: { glow: 'rgba(59,130,246,0.5)', border: 'rgba(59,130,246,0.3)' },
        red: { glow: 'rgba(239,68,68,0.5)', border: 'rgba(239,68,68,0.3)' }
    };
    const c = colors[glow] || colors.cyan;

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            onMouseMove={handleMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { setHover(false); setMouse({ x: 0.5, y: 0.5 }); }}
            onClick={onClick}
            style={{
                transform: hover
                    ? `perspective(1200px) rotateX(${(mouse.y - 0.5) * 15 * depth}deg) rotateY(${(mouse.x - 0.5) * -15 * depth}deg) scale3d(1.02, 1.02, 1.02)`
                    : 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
                transition: 'transform 0.2s ease-out',
                transformStyle: 'preserve-3d'
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Dynamic Glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300" style={{
                opacity: hover ? 1 : 0,
                background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, ${c.glow}, transparent 60%)`
            }} />
            {/* Reflection Shine */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden transition-opacity duration-300" style={{ opacity: hover ? 0.15 : 0 }}>
                <div className="absolute w-[300%] h-[300%] -top-full -left-full" style={{
                    background: `conic-gradient(from 0deg at 50% 50%, transparent, rgba(255,255,255,0.3) 10%, transparent 20%)`,
                    transform: `rotate(${mouse.x * 360}deg)`
                }} />
            </div>
            {/* Glow Border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300" style={{
                boxShadow: hover ? `0 0 50px ${c.glow}, inset 0 0 30px ${c.glow.replace('0.5', '0.1')}` : 'none',
                border: hover ? `1px solid ${c.border}` : '1px solid transparent'
            }} />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

// Magnetic Button with Ripple
const MagButton = ({ children, className = '', onClick }) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState([]);

    const handleMove = (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setOffset({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
    };

    const handleClick = (e) => {
        const r = ref.current.getBoundingClientRect();
        const id = Date.now();
        setRipples(p => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 600);
        onClick?.();
    };

    return (
        <motion.button
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMove}
            onMouseLeave={() => setOffset({ x: 0, y: 0 })}
            onClick={handleClick}
            animate={{ x: offset.x, y: offset.y }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {children}
            {ripples.map(r => (
                <span key={r.id} className="absolute rounded-full bg-white/40 animate-[ripple_0.6s_ease-out_forwards]" style={{ left: r.x, top: r.y, transform: 'translate(-50%,-50%)' }} />
            ))}
        </motion.button>
    );
};

// Animated Counter
const Counter = ({ value, suffix = '', duration = 1200 }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setVal(end); clearInterval(timer); }
            else setVal(Number.isInteger(end) ? Math.floor(start) : parseFloat(start.toFixed(1)));
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <span>{val}{suffix}</span>;
};

// Floating Animation Wrapper
const Float = ({ children, delay = 0, y = 8, duration = 3 }) => (
    <motion.div animate={{ y: [-y, y, -y] }} transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}>
        {children}
    </motion.div>
);

// Glowing Icon
const GlowIcon = ({ icon, color = 'cyan', size = 10 }) => {
    const colors = {
        cyan: 'bg-primary/20 text-primary shadow-primary/40',
        green: 'bg-green-500/20 text-green-400 shadow-green-500/40',
        yellow: 'bg-yellow-500/20 text-yellow-400 shadow-yellow-500/40',
        purple: 'bg-purple-500/20 text-purple-400 shadow-purple-500/40',
        blue: 'bg-blue-500/20 text-blue-400 shadow-blue-500/40',
        red: 'bg-red-500/20 text-red-400 shadow-red-500/40'
    };
    return (
        <motion.div
            className={`size-${size} rounded-xl ${colors[color]} flex items-center justify-center shadow-lg`}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
        >
            <span className="material-symbols-outlined">{icon}</span>
        </motion.div>
    );
};

// Particle Field Background
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [-50, -150], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
        ))}
    </div>
);

// ==================== MAIN DASHBOARD ====================

export default function RecoveryDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const mainRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showBodyModal, setShowBodyModal] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleBodyPartClick = (part) => {
        setSelectedBodyPart(part);
        setShowBodyModal(true);
    };

    const greeting = () => {
        const h = time.getHours();
        return h < 12 ? '☀️ Good Morning' : h < 17 ? '🌤️ Good Afternoon' : '🌙 Good Evening';
    };

    const containerVars = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    };
    const cardVars = {
        hidden: { opacity: 0, y: 30, rotateX: -8 },
        show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <div ref={mainRef} className="flex h-screen w-full bg-[#050708] text-white font-sans overflow-hidden">
            <MouseSpotlight containerRef={mainRef} />

            {/* Modals */}
            <AIChatWidget isOpen={showChat} onClose={() => setShowChat(false)} />
            <SymptomModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <BodyStatusModal isOpen={showBodyModal} onClose={() => setShowBodyModal(false)} bodyPart={selectedBodyPart} />

            {/* Sidebar */}
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            {/* Main */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#050708] via-[#0a0d10] to-[#050708]" />
                <Particles />

                {/* Glowing Orbs */}
                <motion.div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }} />
                <motion.div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 12, repeat: Infinity }} />

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(8,232,222,1) 1px, transparent 1px), linear-gradient(90deg, rgba(8,232,222,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

                {/* Header */}
                <motion.header
                    className="h-20 flex items-center justify-between px-8 z-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl"
                    initial={{ y: -80 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100 }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <motion.div className="size-2.5 rounded-full bg-green-500"
                                animate={{ boxShadow: ['0 0 0px rgba(34,197,94,0.6)', '0 0 12px rgba(34,197,94,0.8)', '0 0 0px rgba(34,197,94,0.6)'] }}
                                transition={{ duration: 1.5, repeat: Infinity }} />
                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-[0.15em]">AI Active</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">
                            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-teal-200">{user?.name?.split(' ')[0] || 'Patient'}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Float y={3} duration={4}>
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                                <span className="text-xs font-mono text-slate-300">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </Float>
                        <MagButton onClick={() => setShowChat(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/15 border border-primary/30 text-white text-xs font-bold">
                            <motion.span className="material-symbols-outlined text-primary" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>smart_toy</motion.span>
                            AI Assistant
                        </MagButton>
                        <div className="relative">
                            <MagButton onClick={() => setShowNotifications(!showNotifications)} className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">notifications</span>
                            </MagButton>
                            <motion.span className="absolute top-1 right-1 size-3 bg-red-500 rounded-full border-2 border-[#050708]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                            <AnimatePresence>{showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}</AnimatePresence>
                        </div>
                    </div>
                </motion.header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
                    <motion.div variants={containerVars} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6" style={{ perspective: '1500px' }}>

                        {/* ===== TOP ROW: Stats ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            {/* Activity */}
                            <motion.div variants={cardVars}>
                                <Card3D glow="cyan" className="rounded-3xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-5 h-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <GlowIcon icon="local_fire_department" color="cyan" />
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Activity</span>
                                    </div>
                                    <div className="flex justify-center py-2"><DailyGoalWidget goal={600} current={420} /></div>
                                    <p className="text-center text-xs text-slate-500 mt-2"><span className="text-primary font-bold"><Counter value={420} /></span> / 600 kcal</p>
                                </Card3D>
                            </motion.div>

                            {/* Recovery Trend */}
                            <motion.div variants={cardVars} className="md:col-span-2">
                                <Card3D glow="green" className="rounded-3xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-5 h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <GlowIcon icon="trending_up" color="green" />
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Recovery</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-white"><Counter value={82} />%</span>
                                                <motion.span className="text-sm font-bold text-green-400 flex items-center"
                                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                                    <motion.span className="material-symbols-outlined text-sm" animate={{ y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity }}>arrow_upward</motion.span>+4%
                                                </motion.span>
                                            </div>
                                        </div>
                                        <select className="bg-black/40 text-slate-400 text-xs rounded-xl px-3 py-2 border border-white/10 outline-none cursor-pointer hover:border-white/20">
                                            <option>This Week</option><option>Last Week</option>
                                        </select>
                                    </div>
                                    <div className="h-28"><RecoveryChart /></div>
                                </Card3D>
                            </motion.div>

                            {/* Pain Level */}
                            <motion.div variants={cardVars}>
                                <Card3D glow="yellow" onClick={() => setShowModal(true)} className="rounded-3xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-5 h-full cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <GlowIcon icon="healing" color="yellow" />
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pain</span>
                                        </div>
                                        <Float y={4} duration={2}><span className="text-2xl">😊</span></Float>
                                    </div>
                                    <div className="text-center py-3">
                                        <span className="text-5xl font-black text-white"><Counter value={2} /></span>
                                        <span className="text-slate-500 text-xl">/10</span>
                                    </div>
                                    <p className="text-xs text-green-400 text-center font-medium mb-3">Excellent day! 🎉</p>
                                    <MagButton className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-white text-xs font-bold flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit_note</span>Log Symptoms
                                    </MagButton>
                                </Card3D>
                            </motion.div>
                        </div>

                        {/* ===== MAIN ROW: Body + Content ===== */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Body Status 3D - UNTOUCHED */}
                            <motion.div variants={cardVars} className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-4 flex flex-col h-[500px]">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <GlowIcon icon="accessibility_new" color="cyan" />
                                        <span className="font-bold text-white text-sm">Body Status</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
                                        <motion.div className="size-1.5 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                        <span className="text-[10px] text-primary font-bold uppercase">3D</span>
                                    </div>
                                </div>
                                <div className="flex-1 rounded-2xl overflow-hidden">
                                    <BodyStatus3D onPartClick={handleBodyPartClick} selectedPart={selectedBodyPart} />
                                </div>
                            </motion.div>

                            {/* Right Column */}
                            <div className="lg:col-span-8 flex flex-col gap-5">

                                {/* ===== MORNING KNEE MOBILITY - FIXED LAYOUT ===== */}
                                <motion.div variants={cardVars}>
                                    <div className="relative rounded-3xl overflow-hidden h-64 cursor-pointer group border border-white/10 bg-[#0a0c10]">
                                        {/* Background Video */}
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="absolute top-0 right-0 w-2/3 h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                            poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
                                        >
                                            <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-doing-physical-therapy-exercises-48889-large.mp4" type="video/mp4" />
                                        </video>

                                        {/* Dark Gradient Over Video */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/90 to-transparent z-[1]" />

                                        {/* Content Container */}
                                        <div className="relative z-[2] h-full flex flex-col justify-center px-8 py-6">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <motion.span
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-black text-xs font-bold"
                                                    animate={{ boxShadow: ['0 0 0px rgba(8,232,222,0.5)', '0 0 20px rgba(8,232,222,0.7)', '0 0 0px rgba(8,232,222,0.5)'] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <motion.span
                                                        className="material-symbols-outlined text-xs"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                    >
                                                        auto_awesome
                                                    </motion.span>
                                                    AI RECOMMENDED
                                                </motion.span>
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] text-white font-bold">
                                                    <motion.span
                                                        className="size-1.5 rounded-full bg-red-500"
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 0.8, repeat: Infinity }}
                                                    />
                                                    LIVE
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                                                Morning Knee Mobility
                                            </h2>

                                            {/* Description */}
                                            <p className="text-slate-400 text-sm mb-5 max-w-md leading-relaxed">
                                                Gentle therapeutic movements to increase blood flow and reduce joint stiffness.
                                            </p>

                                            {/* CTA Row */}
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <MagButton
                                                    onClick={() => navigate('/workout')}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm"
                                                >
                                                    <motion.span
                                                        className="material-symbols-outlined text-base"
                                                        animate={{ x: [0, 3, 0] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        play_arrow
                                                    </motion.span>
                                                    Start Session
                                                </MagButton>

                                                {/* Stats */}
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                                                        15 min
                                                    </span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
                                                        Easy
                                                    </span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                                        4.9
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Progress Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-[3]">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary to-cyan-400"
                                                initial={{ width: '0%' }}
                                                animate={{ width: '35%' }}
                                                transition={{ delay: 0.5, duration: 1.5 }}
                                            />
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[4]"
                                            style={{ boxShadow: 'inset 0 0 60px rgba(8,232,222,0.1), 0 0 30px rgba(8,232,222,0.1)' }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Appointment */}
                                    <motion.div variants={cardVars}>
                                        <Card3D glow="cyan" className="rounded-3xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-5 h-full">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl overflow-hidden relative shrink-0">
                                                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" alt="" className="w-full h-full object-cover" />
                                                    <motion.div className="absolute bottom-0.5 right-0.5 size-3 bg-green-500 rounded-full border-2 border-[#0d1015]"
                                                        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="material-symbols-outlined text-primary text-xs">event</span>
                                                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Next Appointment</span>
                                                    </div>
                                                    <h4 className="font-bold text-white truncate">Dr. Sarah Chen</h4>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">schedule</span>Tomorrow, 10:00 AM
                                                    </p>
                                                </div>
                                                <MagButton className="size-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30">
                                                    <span className="material-symbols-outlined text-primary">videocam</span>
                                                </MagButton>
                                            </div>
                                        </Card3D>
                                    </motion.div>

                                    {/* Quick Stats */}
                                    <motion.div variants={cardVars} className="grid grid-cols-2 gap-4">
                                        <Card3D glow="blue" className="rounded-2xl bg-gradient-to-br from-[#0a1525] to-[#080d15] border border-blue-500/20 p-4 flex flex-col items-center text-center">
                                            <GlowIcon icon="water_drop" color="blue" size={10} />
                                            <span className="text-xl font-black text-white mt-2"><Counter value={1.2} suffix="L" /></span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Hydration</span>
                                            <div className="w-full h-1 bg-blue-500/20 rounded-full mt-2 overflow-hidden">
                                                <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                                    initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ delay: 0.6, duration: 1 }} />
                                            </div>
                                        </Card3D>
                                        <Card3D glow="purple" className="rounded-2xl bg-gradient-to-br from-[#180d28] to-[#100818] border border-purple-500/20 p-4 flex flex-col items-center text-center">
                                            <GlowIcon icon="bedtime" color="purple" size={10} />
                                            <span className="text-xl font-black text-white mt-2">7h 20m</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sleep</span>
                                            <div className="flex items-center gap-0.5 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.span key={i} className={`material-symbols-outlined text-xs ${i < 4 ? 'text-purple-400' : 'text-purple-400/30'}`}
                                                        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}>star</motion.span>
                                                ))}
                                            </div>
                                        </Card3D>
                                    </motion.div>
                                </div>

                                {/* Quick Actions */}
                                <motion.div variants={cardVars} className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: 'fitness_center', label: 'Exercises', color: 'cyan', path: '/exercises' },
                                        { icon: 'video_call', label: 'Tele-Doctor', color: 'green', path: '/tele-doctor' },
                                        { icon: 'analytics', label: 'Analytics', color: 'purple', path: '/analytics' }
                                    ].map((a) => (
                                        <Card3D key={a.label} glow={a.color} onClick={() => navigate(a.path)} className="rounded-2xl bg-gradient-to-br from-[#0d1015] to-[#080a0d] border border-white/5 p-4 flex flex-col items-center gap-2 cursor-pointer">
                                            <GlowIcon icon={a.icon} color={a.color} />
                                            <span className="text-xs font-bold text-slate-300">{a.label}</span>
                                        </Card3D>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Global Styles */}
            <style>{`
                @keyframes ripple { from { width: 0; height: 0; opacity: 0.6; } to { width: 400px; height: 400px; opacity: 0; } }
                @keyframes scanlines { from { transform: translateY(0); } to { transform: translateY(4px); } }
            `}</style>
        </div>
    );
}

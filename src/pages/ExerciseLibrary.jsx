import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import PatientGlassSidebar from '../components/dashboard/PatientGlassSidebar';
import { EXERCISE_DATA } from '../data/ExerciseData';

const PHASES = ['All', 'Acute', 'Mobility', 'Stability', 'Strength'];

// 3D Tilt Card Component with Advanced Effects
function ExerciseCard3D({ exercise, onClick, index }) {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 400, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative cursor-pointer group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d'
                }}
                whileHover={{ scale: 1.02, z: 50 }}
                className="relative bg-gradient-to-br from-[#1a1d24] to-[#12151a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
                {/* Shine Effect Overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8, 232, 222, 0.15), transparent 50%)`
                    }}
                />

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12151a] via-[#12151a]/50 to-transparent z-10" />

                    {/* Image */}
                    <motion.img
                        src={exercise.image}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0.7 }}
                        whileHover={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Floating Badge */}
                    <motion.div
                        className="absolute top-4 left-4 z-20"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
                    >
                        <div className="px-3 py-1.5 bg-black/70 backdrop-blur-xl rounded-xl border border-primary/40 flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{exercise.category}</span>
                        </div>
                    </motion.div>

                    {/* Play Button Overlay */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="absolute inset-0 z-20 flex items-center justify-center"
                            >
                                <div className="size-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(8,232,222,0.8)]">
                                    <span className="material-symbols-outlined text-3xl text-black font-bold">play_arrow</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-20" style={{ transform: 'translateZ(20px)' }}>
                    {/* Title */}
                    <motion.h3
                        className="text-xl font-black text-white mb-1 group-hover:text-primary transition-colors"
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        {exercise.title}
                    </motion.h3>

                    {/* Clinical Name */}
                    <p className="text-xs text-slate-500 font-mono mb-4">{exercise.clinicalName}</p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                            <span className="font-medium">{exercise.duration}</span>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${exercise.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {exercise.difficulty}
                        </div>
                    </div>

                    {/* Target Info */}
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-3 rounded-xl border border-primary/20">
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <span className="text-primary font-bold">Target: </span>
                            {exercise.indications}
                        </p>
                    </div>
                </div>

                {/* Depth Shadow */}
                <div className="absolute inset-0 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] pointer-events-none" style={{ transform: 'translateZ(-10px)' }} />
            </motion.div>
        </motion.div>
    );
}

// Animated Filter Pill
function FilterPill({ phase, isActive, onClick }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all border overflow-hidden ${isActive
                    ? 'bg-primary text-black border-primary'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
        >
            {/* Glow Effect */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 bg-primary/30 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Ripple on Click */}
            <span className="relative z-10">
                {phase === 'All' ? 'All Phases' : `Phase: ${phase}`}
            </span>
        </motion.button>
    );
}

export default function ExerciseLibrary() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [activePhase, setActivePhase] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filteredExercises = EXERCISE_DATA.filter(ex => {
        const matchesPhase = activePhase === 'All' || ex.phase === activePhase;
        const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.clinicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesPhase && matchesSearch;
    });

    const handleStartWorkout = (exerciseId) => {
        const selectedExercise = EXERCISE_DATA.find(e => e.id === exerciseId);
        navigate('/workout', {
            state: {
                exerciseId: exerciseId,
                clinicalContext: exerciseId,
                exerciseTitle: selectedExercise?.title
            }
        });
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0e12] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Noise Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

                    {/* Floating Orbs */}
                    <motion.div
                        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"
                        animate={{
                            x: [0, -30, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                {/* Premium Hero Section */}
                <div className="relative z-10 px-8 pt-8 pb-6 border-b border-white/5 bg-gradient-to-b from-[#0a0e12] to-transparent">
                    <div className="max-w-7xl mx-auto">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <motion.div
                                        className="size-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <span className="material-symbols-outlined text-2xl text-black font-bold">medical_services</span>
                                    </motion.div>
                                    <div>
                                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                            Exercise Library
                                        </h1>
                                        <p className="text-sm text-slate-500 mt-1">Prescribed protocols & functional movements</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats Cards */}
                            <motion.div
                                className="flex gap-4"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 text-center">
                                    <div className="text-3xl font-black text-primary mb-1">{EXERCISE_DATA.length}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Exercises</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 text-center">
                                    <div className="text-3xl font-black text-purple-400 mb-1">{filteredExercises.length}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Filtered</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Search & Filters Row */}
                        <div className="flex items-center gap-4">
                            {/* Advanced Search */}
                            <motion.div
                                className="flex-1 relative group"
                                animate={{ width: isSearchFocused ? '100%' : 'auto' }}
                            >
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors z-10">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search exercises, targets, clinical names..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />

                                {/* Search Result Count */}
                                {searchQuery && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary"
                                    >
                                        {filteredExercises.length} found
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Phase Filters */}
                <div className="relative z-10 px-8 py-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {PHASES.map((phase, index) => (
                                <motion.div
                                    key={phase}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                >
                                    <FilterPill
                                        phase={phase}
                                        isActive={activePhase === phase}
                                        onClick={() => setActivePhase(phase)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Exercise Grid */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 scroll-smooth z-10">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="popLayout">
                            {filteredExercises.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {filteredExercises.map((exercise, index) => (
                                        <ExerciseCard3D
                                            key={exercise.id}
                                            exercise={exercise}
                                            index={index}
                                            onClick={() => handleStartWorkout(exercise.id)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20"
                                >
                                    <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-5xl text-slate-600">search_off</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">No exercises found</h3>
                                    <p className="text-sm text-slate-600">Try adjusting your filters or search query</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

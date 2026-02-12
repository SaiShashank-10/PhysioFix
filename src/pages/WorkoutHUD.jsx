import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from "react-webcam";
import { motion, AnimatePresence } from 'framer-motion';
import { usePoseTracking } from "../hooks/usePoseTracking";
import { useWorkoutLogic } from "../hooks/useWorkoutLogic";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import CanvasOverlay from "../components/CanvasOverlay";
import PainTracker from "../components/PainTracker";
import { EXERCISE_DATA } from "../data/ExerciseData";

export default function WorkoutHUD() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedExercise, setSelectedExercise] = useState(location.state?.exerciseId || "auto");
    const { videoRef, poses, analysis, status, detectedExercise } = usePoseTracking(selectedExercise);

    // Logic: If Auto, use detected. If specific, use user selected.
    const activeExerciseId = selectedExercise === "auto" ? detectedExercise : selectedExercise;
    const displayTitle = location.state?.exerciseTitle || (selectedExercise === "auto" ? detectedExercise : selectedExercise);

    const { reps, workoutState, calories, calibrationState, startCalibration, romStats } = useWorkoutLogic(analysis, activeExerciseId);

    const [videoConstraints, setVideoConstraints] = useState({
        width: 1280,
        height: 720,
        facingMode: "user"
    });

    // Real-time Timer
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const { isListening, lastCommand, transcript, startListening } = useVoiceCommands({
        "start session": () => console.log("Voice: Start Session"),
        "stop session": () => console.log("Voice: Stop Session"),
        "calibration": startCalibration,
        "show me stats": () => console.log("Voice: Show Stats")
    });



    // Auto-start listening on mount
    useEffect(() => {
        startListening();
    }, []);

    const isLoading = status !== "Tracking Active" && status !== "Camera Active (No person detected)";

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-hidden text-slate-900 dark:text-white selection:bg-primary selection:text-background-dark font-sans">
            {/* Top Navigation */}
            <header className="w-full border-b border-[#214a4a] bg-[#102323] px-6 py-4 z-20">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3 text-white">
                        <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                            <span className="material-symbols-outlined">vital_signs</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">PhysioFix</h2>
                        {/* Voice Feedback Badge */}
                        <AnimatePresence>
                            {lastCommand && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="ml-4 flex items-center gap-2 bg-primary text-[#102323] px-3 py-1 rounded-full animate-pulse transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">mic</span>
                                    <span className="text-xs font-bold uppercase">"{lastCommand}"</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Header Stats (Visible on desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">timer</span>
                            <span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} Elapsed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">monitor_heart</span>
                            <span>{Math.round(110 + Math.random() * 20)} BPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            <span>{Math.max(0, calories).toFixed(1)} Kcal</span>
                        </div>
                    </div>
                    {/* User / Exit */}
                    <div className="flex items-center gap-6">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-[#214a4a]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkQR6azGm3dXljEn9yJM4oPSsWems7lIFI1iIBflafStoTit207Ydh8qwweBFVm_MpDZipvsb3kP709ba73zHrLhgSz344w1jo2vIPCWfx4VFny2NPijYE56Py5h-xQXHOdxv3uvWKWoNWimKzDt6Ud2Jkf4bXOPk9SpeSemDyvAaRVCIip5c3-TnoCQ51xVSH80vYCx3T5NRcsEw1fb8HuD6f3tJ8HIFPNGOPDAskvkL63avRlYPp-MtMh1cSGDmocgBPWKQQ2KWJ")' }}>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hidden sm:flex cursor-pointer items-center gap-2 rounded-lg bg-[#1a3838] hover:bg-[#234b4b] transition-colors h-10 px-4 text-white text-sm font-bold border border-[#214a4a] z-50 pointer-events-auto"
                        >
                            <span>Exit Session</span>
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                </div>
            </header>
            {/* Main Content Area (HUD) */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 relative">
                {/* Camera Feed Container */}
                <div className="relative w-full max-w-[1200px] aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(5,204,204,0.15)] border border-[#214a4a] group">

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 text-white">
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-mono text-sm">{status}</p>
                            </div>
                        </div>
                    )}

                    {/* Calibration Overlay */}
                    {(calibrationState.state === "STATIC_CALIBRATION" || calibrationState.state === "ROM_CALIBRATION") && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm text-white"
                        >
                            <div className="flex flex-col items-center gap-6 p-8 bg-black/80 border border-primary rounded-2xl max-w-md text-center shadow-2xl shadow-primary/20">
                                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">settings_accessibility</span>
                                <h3 className="text-2xl font-bold">Calibration in Progress</h3>
                                <p className="text-lg text-gray-300">{calibrationState.message}</p>
                                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${calibrationState.progress || 0}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <Webcam
                        ref={videoRef}
                        audio={false}
                        width={1280}
                        height={720}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="absolute inset-0 w-full h-full object-cover"
                        onUserMedia={() => console.log("Webcam: User Media Triggered")}
                        onUserMediaError={(err) => {
                            console.error("Webcam Error:", err);
                            alert("Camera Access Denied or Error. Please check permissions.");
                        }}
                    />

                    <CanvasOverlay poses={poses} analysis={analysis} width={1280} height={720} />

                    {/* Dark Overlay Gradient for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none"></div>

                    {/* HUD Overlay Elements */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                        {/* TOP ROW */}
                        <div className="flex justify-between items-start">
                            <PainTracker onSave={(log) => console.log("Pain Log:", log)} />
                            {/* Voice Indicator */}
                            <div className="hidden md:flex flex-col gap-1 items-start">
                                <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border transition-colors ${isListening ? 'border-primary/50 text-white' : 'border-white/10 text-gray-400'}`}>
                                    <span className={`material-symbols-outlined text-lg ${isListening ? 'text-primary animate-pulse' : ''}`}>mic</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">{isListening ? "Listening" : "Mic Off"}</span>
                                </div>
                                {isListening && (
                                    <div className="flex gap-0.5 h-4 items-end pl-2 opacity-50">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`w-1 bg-primary rounded-full animate-[bounce_1s_infinite]`} style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 12 + 4}px` }}></div>
                                        ))}
                                    </div>
                                )}
                                {/* Live Transcript Feedback */}
                                {transcript && (
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-[10px] text-gray-400 bg-black/50 px-2 py-1 rounded max-w-[150px] truncate"
                                    >
                                        "{transcript}"
                                    </motion.p>
                                )}
                            </div>

                            {/* Central Rep Counter */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-8 flex flex-col items-center">
                                <div className="flex items-baseline gap-1 drop-shadow-lg">
                                    <motion.span
                                        key={reps}
                                        initial={{ scale: 1.5, color: '#05cccc' }}
                                        animate={{ scale: 1, color: '#ffffff' }}
                                        className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter"
                                    >
                                        {reps}
                                    </motion.span>
                                    <span className="text-3xl md:text-4xl font-bold text-gray-400 leading-none">/</span>
                                    <span className="text-3xl md:text-4xl font-bold text-gray-400 leading-none">12</span>
                                </div>
                                <span className="text-sm font-bold text-primary uppercase tracking-[0.2em] mt-1 drop-shadow-md">Reps ({workoutState})</span>
                            </div>

                            {/* Form Accuracy Gauge (Right) */}
                            <AnimatePresence>
                                <div className="bg-[#102323]/80 backdrop-blur-lg border border-[#214a4a] p-4 rounded-xl w-48 shadow-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-gray-300 text-xs font-semibold uppercase tracking-wide">
                                            {(displayTitle || "Auto").replace(/_/g, " ")}
                                        </p>
                                        <h3 className="text-primary text-xs font-bold uppercase tracking-wider">{workoutState}</h3>
                                    </div>
                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-3xl font-bold text-white leading-none">{Math.round(analysis.angle || 0)}°</span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-2 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full shadow-[0_0_10px_rgba(5,204,204,0.5)]`}
                                            animate={{ width: `${Math.min((analysis.angle || 0) / 1.8, 100)}%`, backgroundColor: (analysis.angle || 0) < 90 ? '#22c55e' : '#05cccc' }}
                                            transition={{ type: "spring", stiffness: 100 }}
                                        />
                                    </div>
                                    <p className="text-right text-primary text-xs font-bold uppercase tracking-wider">{analysis.feedback || "Ready"}</p>
                                </div>
                            </AnimatePresence>
                        </div>

                        {/* ROM Visualizer (New Feature) */}
                        <div className="absolute left-8 bottom-32 z-30">
                            <div className="bg-[#102323]/80 backdrop-blur-md rounded-xl p-4 border border-[#2f6a6a] w-64">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white text-xs font-bold uppercase">Range of Motion</h4>
                                    <span className="text-primary text-xs">{analysis.angle ? Math.round(analysis.angle) + "°" : "--"}</span>
                                </div>
                                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                                    {/* Min-Max Range Indicator */}
                                    {/* Assuming 0-180 degree range standard */}
                                    <div
                                        className="absolute top-0 bottom-0 bg-primary/30"
                                        style={{
                                            left: `${(romStats?.min || 0) / 180 * 100}%`,
                                            right: `${100 - ((romStats?.max || 180) / 180 * 100)}%`
                                        }}
                                    ></div>
                                    {/* Current Indicator */}
                                    <motion.div
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"
                                        animate={{ left: `${(analysis.angle || 0) / 180 * 100}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                                    <span>0°</span>
                                    <span>90°</span>
                                    <span>180°</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM ROW */}
                        <div className="flex flex-col items-center justify-end w-full pb-8">
                            {/* Live Coaching Feedback */}
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={analysis.feedback}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`size-2 rounded-full animate-pulse ${analysis.feedback.includes("Good") || analysis.feedback.includes("Perfect") ? "bg-green-500" : "bg-orange-400"}`}></span>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${analysis.feedback.includes("Good") || analysis.feedback.includes("Perfect") ? "text-green-500" : "text-orange-400"}`}>
                                            {analysis.feedback.includes("Good") ? "Perfect Form" : "Real-time Feedback"}
                                        </span>
                                    </div>
                                    <div className={`backdrop-blur-xl border-l-4 px-8 py-4 rounded-r-lg shadow-2xl max-w-lg transition-colors duration-300 ${analysis.feedback.includes("Good") || analysis.feedback.includes("Perfect") ? "bg-green-900/40 border-green-500" : "bg-orange-900/40 border-orange-500"}`}>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white text-center leading-tight">{analysis.feedback}</h1>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Emergency / Pain Threshold Control Bar */}
                <div className="w-full max-w-[1200px] mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Connection Status */}
                    <div className="hidden md:flex items-center gap-3 text-gray-400 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a3838] rounded-full border border-[#214a4a]">
                            <span className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span className="font-mono">CAM_01 ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a3838] rounded-full border border-[#214a4a]">
                            <span className="material-symbols-outlined text-xs">wifi</span>
                            <span className="font-mono">LOW LATENCY</span>
                        </div>

                        {calibrationState.state === "IDLE" && (
                            <button onClick={startCalibration} className="text-xs flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-full border border-primary/50 transition-colors">
                                <span className="material-symbols-outlined text-sm">tune</span>
                                <div className="flex flex-col">
                                    <span className="font-bold">CALIBRATE</span>
                                    <span className="text-[9px] opacity-70">"Start Calibration"</span>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Exercise Selector */}
                    <div className="flex justify-center">
                        <select
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="bg-[#1a3838] text-white text-sm font-bold border border-[#214a4a] rounded-lg px-4 py-2 outline-none focus:border-primary"
                        >
                            <option value="auto">✨ AI Auto-Detect</option>
                            {EXERCISE_DATA.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.title}</option>
                            ))}
                        </select>
                    </div>
                    {/* Emergency Stop */}
                    <div className="flex justify-center md:justify-end w-full">
                        <button className="group relative flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 hover:border-red-600 px-8 py-4 rounded-xl w-full md:w-auto transition-all duration-300">
                            <div className="bg-red-500 text-white rounded-full p-1 group-hover:bg-white group-hover:text-red-600 transition-colors">
                                <span className="material-symbols-outlined text-xl block">pan_tool</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold uppercase leading-none tracking-wider">Pain Threshold</span>
                                <span className="text-lg font-black uppercase leading-none">Emergency Stop</span>
                            </div>
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}


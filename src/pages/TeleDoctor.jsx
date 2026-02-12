import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { webRTC } from "../services/tele-doctor/WebRTCService";
import { usePoseTracking } from "../hooks/usePoseTracking";
import { useAuthStore } from "../store/useAuthStore";
import { useAppointmentStore } from "../store/useAppointmentStore";
import CanvasOverlay from "../components/CanvasOverlay";
import PatientGlassSidebar from "../components/dashboard/PatientGlassSidebar";

// 3D Tilt Control Button Component
function ControlBtn3D({ onClick, active = false, icon, danger = false, label, activeColor, index = 0 }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 400, damping: 30 });

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
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
            className="relative group"
        >
            <motion.button
                onClick={onClick}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.1, z: 10 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    size-12 rounded-2xl flex items-center justify-center transition-all duration-200 border relative overflow-hidden
                    ${danger
                        ? "bg-red-500 text-white border-red-400 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                        : active
                            ? "bg-gradient-to-br from-white to-gray-200 text-black border-white shadow-lg"
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-xl"
                    }
                    ${activeColor && active ? activeColor : ""}
                `}
                title={label}
            >
                {/* Shine effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255, 255, 255, 0.2), transparent 50%)`
                    }}
                />
                <span className="material-symbols-outlined text-[22px] relative z-10" style={{ transform: 'translateZ(10px)' }}>{icon}</span>
            </motion.button>

            {/* Label tooltip */}
            {label && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/90 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap border border-white/20">
                        {label}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default function TeleDoctor() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { appointments, completeAppointment } = useAppointmentStore();
    const { appointmentId } = location.state || {};

    const [searchParams] = useSearchParams();
    const [role, setRole] = useState(searchParams.get("role") || "patient");

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const [rightPanelMode, setRightPanelMode] = useState("none");
    const [chatMessages, setChatMessages] = useState([]);
    const [inputText, setInputText] = useState("");

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);

    const [remoteIsMuted, setRemoteIsMuted] = useState(false);
    const [remoteIsVideoOff, setRemoteIsVideoOff] = useState(false);

    const [reactions, setReactions] = useState([]);
    const { videoRef, poses, analysis, status } = usePoseTracking("squat");
    const [patientData, setPatientData] = useState(null);

    const [time, setTime] = useState(new Date());
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isConnected) {
            const durationTimer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
            return () => clearInterval(durationTimer);
        } else {
            setCallDuration(0);
        }
    }, [isConnected]);

    useEffect(() => {
        const init = async () => {
            await webRTC.init(localVideoRef.current, role);

            webRTC.onConnectionStateChange = (connected) => {
                setIsConnected(connected);
                if (connected) {
                    setRemoteIsMuted(false);
                    setRemoteIsVideoOff(false);
                }
            };

            webRTC.onDataMessage = (msg) => {
                if (msg.type === "SKELETON_UPDATE") {
                    setPatientData({ poses: msg.payload.poses, analysis: msg.payload.analysis });
                } else if (msg.type === "CHAT") {
                    setChatMessages(prev => [...prev, { sender: msg.payload.sender, text: msg.payload.text, isSelf: false }]);
                } else if (msg.type === "REACTION") {
                    triggerReaction(msg.payload.emoji);
                } else if (msg.type === "MEDIA_STATE") {
                    if (msg.payload.type === "audio") setRemoteIsMuted(!msg.payload.enabled);
                    if (msg.payload.type === "video") setRemoteIsVideoOff(!msg.payload.enabled);
                }
            };

            webRTC.onStreamUpdate = (stream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
            };
        };
        init();
    }, [role]);

    useEffect(() => {
        if (role === "patient" && isConnected && poses.length > 0) {
            webRTC.sendMessage("SKELETON_UPDATE", { poses, analysis });
        }
    }, [poses, isConnected, role]);

    const handleStartCall = () => webRTC.startCall();

    const handleEndCall = () => {
        webRTC.endCall();
        if (appointmentId) {
            completeAppointment(appointmentId);
        } else {
            const myAppointments = appointments.filter(a => a.patientId === user?.id);
            const activeAppt = myAppointments.find(a => a.status === 'approved');
            if (activeAppt) completeAppointment(activeAppt.id);
        }
        navigate('/tele-doctor');
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        webRTC.sendChat(inputText);
        setChatMessages(prev => [...prev, { sender: "Me", text: inputText, isSelf: true }]);
        setInputText("");
    };

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        webRTC.toggleAudio(!newState);
    };

    const toggleVideo = () => {
        const newState = !isVideoOff;
        setIsVideoOff(newState);
        webRTC.toggleVideo(!newState);
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            const success = await webRTC.startScreenShare(localVideoRef.current);
            if (success) setIsScreenSharing(true);
        } else {
            await webRTC.stopScreenShare(localVideoRef.current);
            setIsScreenSharing(false);
        }
    };

    const toggleHandRaise = () => {
        setIsHandRaised(!isHandRaised);
        webRTC.sendReaction(isHandRaised ? "✋⬇️" : "✋");
        if (!isHandRaised) triggerReaction("✋");
    };

    const sendReaction = (emoji) => {
        webRTC.sendReaction(emoji);
        triggerReaction(emoji);
    };

    const triggerReaction = (emoji) => {
        const id = Date.now() + Math.random();
        const startX = 20 + Math.random() * 60;
        setReactions(prev => [...prev, { id, emoji, x: startX }]);
        setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2500);
    };

    const REACTIONS_LIST = ["👍", "❤️", "🔥", "😂", "👏", "🎉"];

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0e12] text-white font-sans overflow-hidden">
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

                    <motion.div
                        className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]"
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                {/* Premium Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10 shrink-0 border-b border-white/5 bg-gradient-to-b from-[#0a0e12] to-transparent backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        {/* Connection Status Badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 border backdrop-blur-xl ${isConnected
                                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                                    : "bg-red-500/10 text-red-400 border-red-500/30"
                                }`}
                        >
                            <motion.div
                                className={`size-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                                animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            {isConnected ? (
                                <>
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                    Live Session Encrypted
                                </>
                            ) : "Offline"}
                        </motion.div>

                        {/* Call Duration */}
                        {isConnected && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-2 text-sm font-mono">
                                    <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                    <span className="text-white font-bold">{formatDuration(callDuration)}</span>
                                </div>
                            </motion.div>
                        )}

                        {role === "patient" && !isConnected && (
                            <motion.button
                                onClick={handleStartCall}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2.5 bg-gradient-to-r from-primary to-cyan-400 text-black rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                            >
                                Connect to Session
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-slate-400 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-purple-400">person</span>
                            <span className="text-white font-bold">{role === "patient" ? "Dr. Sarah Smith" : "Alex Morgan"}</span>
                        </div>
                        <div className="h-5 w-px bg-white/10" />
                        <div className="flex items-center gap-2 font-mono">
                            <span className="material-symbols-outlined text-primary">calendar_today</span>
                            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ControlBtn3D onClick={() => setRole(role === "patient" ? "doctor" : "patient")} icon="switch_account" label="Switch Role" index={0} />
                        <ControlBtn3D
                            onClick={() => setRightPanelMode(rightPanelMode === "people" ? "none" : "people")}
                            active={rightPanelMode === "people"}
                            icon="group"
                            label="Participants"
                            index={1}
                        />
                        <ControlBtn3D
                            onClick={() => setRightPanelMode(rightPanelMode === "chat" ? "none" : "chat")}
                            active={rightPanelMode === "chat"}
                            icon="chat"
                            label="Chat"
                            index={2}
                        />
                    </div>
                </header>

                {/* Main Stage */}
                <div className="flex-1 flex overflow-hidden p-6 gap-6 relative z-10">
                    {/* Video Area */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Main Video Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring' }}
                            className="flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl relative group"
                        >
                            {/* Glass reflection overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

                            {/* Floating Reactions */}
                            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                                <AnimatePresence>
                                    {reactions.map(r => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
                                            animate={{ opacity: [0, 1, 1, 0], y: -250, scale: [0.5, 1.5, 1.8, 1.5], rotate: 10 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 2.5, ease: "easeOut" }}
                                            className="absolute bottom-24 text-6xl filter drop-shadow-2xl"
                                            style={{ left: `${r.x}%` }}
                                        >
                                            {r.emoji}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Remote Video */}
                            <div className="flex-1 relative flex items-center justify-center bg-black/50">
                                {/* Participant Name Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3"
                                >
                                    <div className={`size-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                                    <span className="text-sm font-bold text-white tracking-wide">
                                        {role === "patient" ? "Dr. Sarah Smith" : "Alex Morgan"}
                                    </span>
                                    {isConnected && <span className="text-xs text-green-400 font-mono">HD</span>}
                                </motion.div>

                                {role === "patient" ? (
                                    <>
                                        <video ref={remoteVideoRef} className={`w-full h-full object-contain ${remoteIsVideoOff ? 'hidden' : ''}`} autoPlay playsInline />
                                        {remoteIsVideoOff && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex flex-col items-center gap-5 text-slate-500"
                                            >
                                                <div className="size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                                                    <span className="text-6xl">👩‍⚕️</span>
                                                </div>
                                                <p className="font-bold text-lg">Video Paused</p>
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <video ref={remoteVideoRef} className={`w-full h-full object-contain ${remoteIsVideoOff ? 'hidden' : ''}`} autoPlay playsInline />
                                        {patientData && patientData.poses && !remoteIsVideoOff && (
                                            <CanvasOverlay poses={patientData.poses} width={1280} height={720} className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90" />
                                        )}
                                        {remoteIsVideoOff && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex flex-col items-center gap-5 text-slate-500"
                                            >
                                                <div className="size-32 rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center border border-white/10">
                                                    <span className="text-6xl">👤</span>
                                                </div>
                                                <p className="font-bold text-lg">Patient Video Paused</p>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {remoteIsMuted && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute top-6 right-6 bg-red-500/20 backdrop-blur-xl p-3 rounded-2xl border border-red-500/40"
                                    >
                                        <span className="material-symbols-outlined text-red-400 text-xl">mic_off</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Self View (PiP) */}
                            <motion.div
                                drag
                                dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
                                dragElastic={0.1}
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute bottom-6 right-6 w-64 aspect-video bg-gradient-to-br from-[#2a2d35] to-[#18191d] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-grab z-30 group/pip"
                            >
                                {/* YOU Badge */}
                                <div className="absolute top-3 left-3 z-10 bg-primary px-3 py-1 rounded-xl text-xs font-black text-black backdrop-blur-sm">
                                    YOU
                                </div>

                                {role === "patient" ? (
                                    <div className="relative w-full h-full">
                                        <video
                                            ref={(el) => { videoRef.current = el; localVideoRef.current = el; }}
                                            className={`w-full h-full object-cover transform -scale-x-100 ${isVideoOff ? 'hidden' : ''}`}
                                            autoPlay playsInline muted
                                        />
                                    </div>
                                ) : (
                                    <video
                                        ref={(el) => localVideoRef.current = el}
                                        className={`w-full h-full object-cover transform -scale-x-100 ${isVideoOff ? 'hidden' : ''}`}
                                        autoPlay playsInline muted
                                    />
                                )}
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl">videocam_off</span>
                                    </div>
                                )}

                                {/* Drag hint */}
                                <div className="absolute inset-0 bg-primary/0 group-hover/pip:bg-primary/5 transition-all pointer-events-none flex items-center justify-center opacity-0 group-hover/pip:opacity-100">
                                    <span className="material-symbols-outlined text-white/50">open_with</span>
                                </div>
                            </motion.div>

                            {/* 3D Control Bar */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-3xl px-8 py-4 flex items-center gap-6 shadow-2xl z-30"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,30,0.9) 100%)',
                                }}
                            >
                                <ControlBtn3D onClick={toggleMute} active={!isMuted} icon={isMuted ? "mic_off" : "mic"} danger={isMuted} label="Microphone" index={0} />
                                <ControlBtn3D onClick={toggleVideo} active={!isVideoOff} icon={isVideoOff ? "videocam_off" : "videocam"} danger={isVideoOff} label="Camera" index={1} />

                                <div className="w-px h-10 bg-white/20" />

                                <ControlBtn3D onClick={toggleScreenShare} active={isScreenSharing} icon="present_to_all" label="Share Screen" index={2} />
                                <ControlBtn3D onClick={toggleHandRaise} active={isHandRaised} icon="back_hand" label="Raise Hand" activeColor="text-yellow-400" index={3} />

                                <div className="w-px h-10 bg-white/20" />

                                {/* Reactions Dropdown */}
                                <div className="relative group/reactions">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="size-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-xl"
                                    >
                                        <span className="material-symbols-outlined text-[22px]">add_reaction</span>
                                    </motion.button>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/reactions:flex bg-black/90 backdrop-blur-2xl border border-primary/30 rounded-2xl p-3 shadow-2xl gap-2 z-50"
                                    >
                                        {REACTIONS_LIST.map(e => (
                                            <motion.button
                                                key={e}
                                                onClick={() => sendReaction(e)}
                                                whileHover={{ scale: 1.3, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-3xl hover:bg-white/10 p-2 rounded-xl transition-all"
                                            >
                                                {e}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* End Call Button */}
                                <motion.button
                                    onClick={handleEndCall}
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-12 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400/30 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ml-2 shadow-lg shadow-red-500/30"
                                >
                                    <span className="material-symbols-outlined text-xl">call_end</span>
                                    <span className="hidden md:inline">End Call</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Panel (Chat/People) */}
                    <AnimatePresence>
                        {rightPanelMode !== "none" && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, x: 50 }}
                                animate={{ width: 360, opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: 50 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="bg-gradient-to-br from-[#1a1d24] to-[#12151a] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                            >
                                {/* Panel Header */}
                                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <h2 className="text-sm font-black tracking-wide uppercase text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">
                                            {rightPanelMode === "chat" ? "chat" : "group"}
                                        </span>
                                        {rightPanelMode === "chat" ? "Session Chat" : "Participants"}
                                    </h2>
                                    <motion.button
                                        onClick={() => setRightPanelMode("none")}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                                    >
                                        <span className="material-symbols-outlined text-xl">close</span>
                                    </motion.button>
                                </div>

                                {rightPanelMode === "chat" ? (
                                    <>
                                        {/* Chat Messages */}
                                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                            {chatMessages.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
                                                >
                                                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.isSelf
                                                            ? "bg-gradient-to-r from-primary to-cyan-400 text-black rounded-br-none font-medium shadow-lg"
                                                            : "bg-white/10 text-slate-200 rounded-bl-none border border-white/10"
                                                        }`}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 mt-1.5 font-mono">{msg.sender}</span>
                                                </motion.div>
                                            ))}
                                            {chatMessages.length === 0 && (
                                                <div className="text-center text-slate-500 text-sm mt-20">
                                                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                                        <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                                                    </div>
                                                    No messages yet. Say hello! 👋
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat Input */}
                                        <form onSubmit={handleSendChat} className="p-4 border-t border-white/10 bg-black/20">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    placeholder="Type message..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-xl"
                                                />
                                                <motion.button
                                                    type="submit"
                                                    disabled={!inputText}
                                                    whileHover={inputText ? { scale: 1.1 } : {}}
                                                    whileTap={inputText ? { scale: 0.9 } : {}}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-black disabled:opacity-30 disabled:from-gray-600 disabled:to-gray-700 disabled:text-slate-500 transition-all shadow-lg"
                                                >
                                                    <span className="material-symbols-outlined text-lg">send</span>
                                                </motion.button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    /* Participants List */
                                    <div className="p-5 space-y-3">
                                        {/* Self */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-black font-black text-lg shadow-lg">
                                                    {user?.name?.[0] || 'Y'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">You</p>
                                                    <p className="text-[10px] text-primary font-bold">
                                                        {role === "patient" ? "Patient" : "Doctor (Host)"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isMuted && <span className="material-symbols-outlined text-sm text-red-400">mic_off</span>}
                                                {isVideoOff && <span className="material-symbols-outlined text-sm text-red-400">videocam_off</span>}
                                            </div>
                                        </motion.div>

                                        {/* Remote Participant */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                    {role === "patient" ? "S" : "A"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">
                                                        {role === "patient" ? "Dr. Sarah Smith" : "Alex Morgan"}
                                                    </p>
                                                    <p className="text-[10px] text-purple-400 font-bold">
                                                        {role === "patient" ? "Doctor" : "Patient"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {remoteIsMuted && <span className="material-symbols-outlined text-sm text-red-400">mic_off</span>}
                                                {remoteIsVideoOff && <span className="material-symbols-outlined text-sm text-red-400">videocam_off</span>}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

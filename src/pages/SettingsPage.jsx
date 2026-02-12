import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import PatientGlassSidebar from '../components/dashboard/PatientGlassSidebar';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout, updateUser, isLoading } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [successMsg, setSuccessMsg] = useState('');

    // Local state for forms
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || ''
    });

    const [healthData, setHealthData] = useState({
        height: user?.height || '',
        weight: user?.weight || '',
        age: user?.age || '',
        gender: user?.gender || 'Prefer not to say',
        injuries: user?.injuries || [],
        conditions: user?.conditions || ''
    });

    const [preferences, setPreferences] = useState({
        theme: user?.theme || 'system',
        units: user?.units || 'metric',
        notifications: user?.notifications ?? true,
        voiceCoach: user?.voiceCoach ?? true
    });

    const handleSave = async (section) => {
        let updates = {};
        if (section === 'profile') updates = profileData;
        if (section === 'health') updates = healthData;
        if (section === 'preferences') updates = preferences;

        const success = await updateUser(updates);
        if (success) {
            setSuccessMsg('Settings saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: 'person' },
        { id: 'health', label: 'Health Data', icon: 'monitor_heart' },
        { id: 'preferences', label: 'App Preferences', icon: 'tune' },
        { id: 'security', label: 'Security', icon: 'lock' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#0f1014] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <PatientGlassSidebar user={user} onLogout={() => { logout(); navigate('/'); }} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all">
                {/* Background Noise Texture (Subtle) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                {/* Background Blurs */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10 shrink-0 border-b border-white/5 bg-[#0f1014]/50 backdrop-blur-md">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">settings</span>
                            Settings & Profile
                        </h1>
                        <p className="text-xs text-slate-400">Manage your account and rehabilitation preferences.</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth z-10 flex gap-8 max-w-7xl mx-auto w-full">

                    {/* Settings Navigation Sidebar (Inner) */}
                    <div className="w-64 space-y-2 shrink-0 hidden md:block">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm border relative overflow-hidden group ${activeTab === tab.id
                                    ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(5,204,204,0.15)]'
                                    : 'bg-[#18191d]/50 text-slate-400 border-white/5 hover:border-white/10 hover:text-white hover:bg-[#18191d]'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-0' : ''}`}></div>
                                <span className="material-symbols-outlined relative z-10">{tab.icon}</span>
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Form */}
                    <div className="flex-1 bg-[#18191d]/80 border border-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                        {/* Success Toast */}
                        <AnimatePresence>
                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                                    className="absolute top-4 left-1/2 bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-2 rounded-full text-sm font-bold z-50 flex items-center gap-2 backdrop-blur-xl"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full flex flex-col"
                            >
                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <div className="space-y-8 animate-slide-up">
                                        <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                                            <div className="size-24 rounded-2xl bg-gradient-to-tr from-primary/20 to-indigo-500/20 relative group cursor-pointer overflow-hidden ring-2 ring-white/5">
                                                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                    <span className="material-symbols-outlined text-white">edit</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400">PATIENT</span>
                                                    <span className="text-sm text-primary">#{user?.id?.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                            <InputGroup label="Email Address" value={profileData.email} disabled />
                                            <InputGroup label="Phone Number" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bio / Notes</label>
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                    className="w-full bg-[#0f1014] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm text-white h-32 resize-none"
                                                    placeholder="Tell us about your recovery goals..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-white/5 mt-auto">
                                            <SaveButton onClick={() => handleSave('profile')} loading={isLoading} />
                                        </div>
                                    </div>
                                )}

                                {/* HEALTH MOCKUP */}
                                {activeTab === 'health' && (
                                    <div className="space-y-8 animate-slide-up">
                                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-4">
                                            <div className="p-3 bg-red-500/10 rounded-lg h-fit text-red-500">
                                                <span className="material-symbols-outlined">medical_information</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-red-500 text-sm uppercase tracking-wide mb-1">Medical Conditions</h3>
                                                <p className="text-xs text-slate-400 mb-3">Please list chronic conditions for AI safety calibration.</p>
                                                <textarea
                                                    value={healthData.conditions}
                                                    onChange={(e) => setHealthData({ ...healthData, conditions: e.target.value })}
                                                    className="w-full bg-[#0f1014] border border-red-500/30 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:bg-red-500/5 transition-all text-sm text-white h-20 resize-none selection:bg-red-500/30"
                                                    placeholder="E.g., Hypertension, Previous ACL surgery..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <InputGroup label="Height (cm)" type="number" value={healthData.height} onChange={(e) => setHealthData({ ...healthData, height: e.target.value })} />
                                            <InputGroup label="Weight (kg)" type="number" value={healthData.weight} onChange={(e) => setHealthData({ ...healthData, weight: e.target.value })} />
                                            <InputGroup label="Age" type="number" value={healthData.age} onChange={(e) => setHealthData({ ...healthData, age: e.target.value })} />
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-white/5 mt-auto">
                                            <SaveButton onClick={() => handleSave('health')} loading={isLoading} />
                                        </div>
                                    </div>
                                )}

                                {/* PREFERENCES */}
                                {activeTab === 'preferences' && (
                                    <div className="space-y-6 animate-slide-up">
                                        <ToggleOption
                                            icon="notifications"
                                            title="Push Notifications"
                                            desc="Receive daily reminders and doctor updates."
                                            checked={preferences.notifications}
                                            onChange={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
                                        />
                                        <ToggleOption
                                            icon="record_voice_over"
                                            title="AI Voice Coach"
                                            desc="Hear real-time feedback during workouts."
                                            checked={preferences.voiceCoach}
                                            onChange={() => setPreferences({ ...preferences, voiceCoach: !preferences.voiceCoach })}
                                        />

                                        <div className="flex items-center justify-between p-4 bg-[#0f1014] rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg text-primary"><span className="material-symbols-outlined">straighten</span></div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">Units</h4>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-1 rounded-lg flex">
                                                <button onClick={() => setPreferences({ ...preferences, units: 'metric' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${preferences.units === 'metric' ? 'bg-primary text-[#0f1014] shadow' : 'text-slate-400 hover:text-white'}`}>Metric</button>
                                                <button onClick={() => setPreferences({ ...preferences, units: 'imperial' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${preferences.units === 'imperial' ? 'bg-primary text-[#0f1014] shadow' : 'text-slate-400 hover:text-white'}`}>Imperial</button>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-white/5 mt-auto">
                                            <SaveButton onClick={() => handleSave('preferences')} loading={isLoading} />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InputGroup({ label, value, onChange, type = "text", placeholder, disabled }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-[#0f1014] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
    );
}

function ToggleOption({ icon, title, desc, checked, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#0f1014] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-primary"><span className="material-symbols-outlined">{icon}</span></div>
                <div>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                    <p className="text-xs text-slate-400">{desc}</p>
                </div>
            </div>
            <button
                onClick={onChange}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${checked ? 'bg-primary shadow-[0_0_10px_rgba(5,204,204,0.4)]' : 'bg-white/10'}`}
            >
                <div className={`size-4 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
}

function SaveButton({ onClick, loading }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-[#0f1014] px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(5,204,204,0.3)] hover:shadow-[0_0_30px_rgba(5,204,204,0.5)]"
        >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">save</span>}
            {loading ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

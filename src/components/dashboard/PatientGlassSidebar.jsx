import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function PatientGlassSidebar({ user, onLogout }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/library', icon: 'format_list_bulleted', label: 'Exercises' },
        { path: '/analytics', icon: 'ssid_chart', label: 'Analytics' },
        { path: '/tele-doctor', icon: 'stethoscope', label: 'Tele-Doctor' },
        { path: '/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <motion.aside
            initial={{ width: 260 }}
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full relative flex flex-col justify-between z-50 border-r border-white/5 bg-[#18191d]/80 backdrop-blur-xl shadow-2xl"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 size-6 bg-[#2a2b30] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:text-[#0f1014] transition-all shadow-lg z-50"
            >
                <span className="material-symbols-outlined text-[10px]">
                    {isCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
            </button>

            <div>
                {/* Brand */}
                <div className="h-24 flex items-center justify-center mb-2 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isCollapsed ? (
                            <motion.span
                                key="icon"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="material-symbols-outlined text-3xl text-primary"
                            >
                                monitor_heart
                            </motion.span>
                        ) : (
                            <motion.div
                                key="full"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-3xl text-primary">monitor_heart</span>
                                    <span className="font-bold text-2xl tracking-tight text-white">PhysioFix</span>
                                </div>
                                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">
                                    Recover Smarter
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Info Compact */}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="px-4 mb-6"
                    >
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="size-10 rounded-full bg-slate-700 bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://i.pravatar.cc/100?img=11")' }}></div>
                            <div className="overflow-hidden">
                                <h4 className="text-sm font-bold text-white truncate">{user?.name || 'Patient'}</h4>
                                <p className="text-xs text-slate-400 truncate capitalize">{user?.plan || 'Free'} Plan</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Nav Items */}
                <nav className="px-3 space-y-1">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all overflow-hidden ${isActive ? 'text-[#0f1014] font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary shadow-[0_0_20px_rgba(5,204,204,0.4)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}

                                <span className={`material-symbols-outlined text-xl relative z-10 ${isActive ? 'text-[#0f1014]' : 'group-hover:text-primary transition-colors'}`}>
                                    {item.icon}
                                </span>

                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="relative z-10 text-sm whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                >
                    <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">logout</span>
                    {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
                </button>
            </div>
        </motion.aside>
    );
}

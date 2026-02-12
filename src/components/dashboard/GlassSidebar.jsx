import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlassSidebar({ activeTab, setActiveTab, onLogout, user }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'overview', icon: 'grid_view', label: 'Overview' },
        { id: 'patients', icon: 'groups', label: 'Patients' },
        { id: 'schedule', icon: 'calendar_month', label: 'Schedule' },
        { id: 'reports', icon: 'analytics', label: 'Analytics' },
        { id: 'messages', icon: 'chat', label: 'Messages', badge: 5 },
    ];

    return (
        <motion.aside
            initial={{ width: 256 }}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full relative flex flex-col justify-between z-50 border-r border-white/10 bg-[#18191d]/60 backdrop-blur-xl shadow-2xl"
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
                <div className="h-20 flex items-center justify-center border-b border-white/5 mb-4 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isCollapsed ? (
                            <motion.span
                                key="icon"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="material-symbols-outlined text-3xl text-primary"
                            >
                                medical_services
                            </motion.span>
                        ) : (
                            <motion.div
                                key="full"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col px-6 w-full"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-3xl text-primary">medical_services</span>
                                    <span className="font-bold text-xl tracking-tight">PhysioPro</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider pl-10">
                                    {user?.clinicName || "Professional Suite"}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav Items */}
                <nav className="p-3 space-y-2">
                    {menuItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`group relative w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all overflow-hidden ${isActive ? 'text-[#0f1014] font-bold' : 'text-slate-400 hover:text-white'
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

                                {item.badge && !isCollapsed && (
                                    <span className="relative z-10 ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge && isCollapsed && (
                                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#18191d]" />
                                )}
                            </button>
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

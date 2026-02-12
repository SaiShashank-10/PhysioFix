import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
    { id: 1, title: 'Session Complete', message: 'You finished "Morning Mobility" successfully!', type: 'success', time: '2m ago' },
    { id: 2, title: 'New Goal', message: 'Coach Sarah updated your weekly target.', type: 'info', time: '1h ago' },
    { id: 3, title: 'Form Alert', message: 'Review your squat depth in the latest session.', type: 'warning', time: '3h ago' },
];

export default function NotificationDropdown({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 bg-white dark:bg-[#183535] rounded-xl shadow-2xl border border-[#e5e7eb] dark:border-[#214a4a] overflow-hidden z-50"
        >
            <div className="p-4 border-b border-[#e5e7eb] dark:border-[#214a4a] flex justify-between items-center">
                <h3 className="font-bold text-[#111418] dark:text-white">Notifications</h3>
                <button onClick={onClose} className="text-xs text-primary font-bold hover:underline">Mark all read</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-[#e5e7eb] dark:border-[#214a4a] last:border-0 hover:bg-[#f8fafc] dark:hover:bg-[#102323] transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                            <div className={`mt-1 size-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-green-500' :
                                    n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                }`} />
                            <div>
                                <h4 className="text-sm font-bold text-[#111418] dark:text-white group-hover:text-primary transition-colors">{n.title}</h4>
                                <p className="text-xs text-[#637588] dark:text-[#8ecccc] mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-[#9ca3af] mt-2">{n.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-[#e5e7eb] dark:border-[#214a4a] bg-[#f8fafc] dark:bg-[#102323]">
                <button className="w-full py-2 text-xs font-bold text-[#637588] dark:text-[#8ecccc] hover:text-[#111418] dark:hover:text-white transition-colors">
                    View All Activity
                </button>
            </div>
        </motion.div>
    );
}

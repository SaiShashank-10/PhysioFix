import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ children, className = "", delay = 0, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white dark:bg-[#183535] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#214a4a] overflow-hidden ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}

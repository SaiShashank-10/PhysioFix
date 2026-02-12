import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatWidget({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hi Alex! I\'m your PhysioFix assistant. How is your knee feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User Message
        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "That sounds encouraging! Consistency is key.",
                "I've noted that. Make sure to ice it for 15 minutes if swelling persists.",
                "Would you like me to adjust your next session intensity?",
                "Great job! Your recovery metrics are looking solid."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const botMsg = { id: Date.now() + 1, sender: 'bot', text: randomResponse };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-[#183535] rounded-2xl shadow-2xl border border-[#e5e7eb] dark:border-[#214a4a] overflow-hidden flex flex-col z-[60]"
                >
                    {/* Header */}
                    <div className="p-4 bg-primary text-[#102323] flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <span className="material-symbols-outlined text-xl">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">PhysioBot</h3>
                                <p className="text-[10px] opacity-80">Always here to help</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] dark:bg-[#102323]">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-[#102323] rounded-tr-none'
                                        : 'bg-white dark:bg-[#183535] dark:text-white border border-[#e5e7eb] dark:border-[#214a4a] rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#183535] border-t border-[#e5e7eb] dark:border-[#214a4a]">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-[#f1f5f9] dark:bg-[#102323] rounded-full pl-4 pr-12 py-2.5 text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-1.5 top-1.5 p-1.5 bg-primary text-[#102323] rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

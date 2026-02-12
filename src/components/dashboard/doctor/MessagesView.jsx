import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService } from '../../../services/chatService';

export default function MessagesView() {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Initial Load & Subscription
    useEffect(() => {
        const loadChats = (updatedChats) => {
            setChats(updatedChats || []);
        };

        // Load initial
        loadChats(chatService.getChats());

        // Subscribe to changes
        const unsubscribe = chatService.subscribe(loadChats);
        return () => unsubscribe();
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChatId, chats]);

    // Derived state for current conversation
    const activeConversation = chats.find(c => c.contactId === selectedChatId);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedChatId) return;

        chatService.sendMessage(selectedChatId, inputText);
        setInputText('');
    };

    const handleSelectChat = (id) => {
        setSelectedChatId(id);
        chatService.markAsRead(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-[calc(100vh-140px)] bg-[#18191d]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Sidebar List */}
            <div className="w-80 border-r border-white/5 flex flex-col bg-[#18191d]/50">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                        <input type="text" placeholder="Search chats..." className="w-full bg-white/5 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-600 transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {chats.map(chat => (
                        <div
                            key={chat.contactId}
                            onClick={() => handleSelectChat(chat.contactId)}
                            className={`p-4 flex gap-3 cursor-pointer transition-all border-l-2 ${selectedChatId === chat.contactId ? 'bg-white/5 border-primary' : 'border-transparent hover:bg-white/5'}`}
                        >
                            <div className="relative">
                                <img src={chat.avatar} alt={chat.name} className="size-10 rounded-full bg-slate-700 object-cover" />
                                <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#18191d] ${chat.unread > 0 ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`font-bold text-sm truncate ${selectedChatId === chat.contactId ? 'text-white' : 'text-slate-300'}`}>{chat.name}</h4>
                                    <span className="text-[10px] text-slate-500">{new Date(chat.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-white font-bold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && <div className="size-5 rounded-full bg-primary text-[#0f1014] text-[10px] font-bold flex items-center justify-center shadow-lg shadow-primary/20 scale-105 animate-pulse">{chat.unread}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedChatId ? (
                <div className="flex-1 flex flex-col bg-[#0f1014]/50 relative">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#18191d]/80 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <img src={activeConversation?.avatar} alt={activeConversation?.name} className="size-10 rounded-full" />
                            <div>
                                <h3 className="font-bold text-white">{activeConversation?.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-green-400">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                            <button className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
                                <span className="material-symbols-outlined">videocam</span>
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {activeConversation?.messages.map(msg => {
                            const isMe = msg.senderId === 'doctor_1'; // Assuming current user ID
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${isMe
                                            ? 'bg-primary text-[#0f1014] rounded-br-none font-medium'
                                            : 'bg-[#2a2b30] text-gray-100 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'opacity-70' : 'opacity-40'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && <span className="material-symbols-outlined text-[12px]">{msg.read ? 'done_all' : 'check'}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-[#18191d]/80 backdrop-blur-md">
                        <form onSubmit={handleSend} className="flex items-center gap-3">
                            <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">add_circle</span>
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-3 bg-primary hover:bg-white text-[#0f1014] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 group"
                            >
                                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-[#0f1014]/50">
                    <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                        <span className="material-symbols-outlined text-4xl opacity-50">chat_bubble</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                    <p className="max-w-xs text-center">Refer to patient history and previous notes before replying.</p>
                </div>
            )}
        </motion.div>
    );
}

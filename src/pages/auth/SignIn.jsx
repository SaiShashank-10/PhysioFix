import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignIn() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.email, formData.password);
        if (success) {
            // Check role from store directly after login
            const user = useAuthStore.getState().user;
            if (user?.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white">
            {/* ... keeping the left side mostly the same ... */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative">
                {/* ... Back to Home link ... */}
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="font-bold text-sm">Back to Home</span>
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-6">
                            <span className="material-symbols-outlined text-2xl">vital_signs</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Enter your credentials to access your recovery dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center justify-between"
                                >
                                    <span>{error}</span>
                                    <button type="button" onClick={clearError}>
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors disabled:opacity-50"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => {
                                        clearError();
                                        setFormData({ ...formData, email: e.target.value });
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors disabled:opacity-50"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => {
                                        clearError();
                                        setFormData({ ...formData, password: e.target.value });
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-[#102323] font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="size-4 border-2 border-[#102323] border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="space-y-4 text-center">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account? {' '}
                            <Link to="/signup" className="font-bold text-primary hover:underline">
                                Create Patient Account
                            </Link>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                            <p className="text-xs text-slate-400 mb-2">Health Professional?</p>
                            <Link to="/doctor-signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span className="material-symbols-outlined text-sm">medical_services</span>
                                Login to Clinician Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden md:flex relative bg-[#102323] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-md p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-4xl font-black text-white mb-4">Recovery Mode: <span className="text-primary">ON</span></h2>
                        <p className="text-lg text-slate-300">
                            "The body achieves what the mind believes. Track your progress, correct your form, and recover faster with AI."
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

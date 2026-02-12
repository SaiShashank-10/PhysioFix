import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignUp() {
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        clearError();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        const success = await signup(formData.name, formData.email, formData.password);
        if (success) {
            navigate('/dashboard'); // Auto login and redirect
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white">
            {/* Left Side - Visual (Swapped for variety) */}
            <div className="hidden md:flex relative bg-[#102323] items-center justify-center overflow-hidden order-2 md:order-1">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-md p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-black text-white mb-4">Start Your <span className="text-primary">Journey</span></h2>
                        <p className="text-lg text-slate-300">
                            Join thousands of patients recovering smarter with PhysioFix AI. Real-time feedback, doctor reports, and faster results.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative order-1 md:order-2">
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                    <span className="font-bold text-sm">Cancel</span>
                    <span className="material-symbols-outlined">close</span>
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Get started with your personalized recovery plan.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence>
                            {(error || passwordError) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm"
                                >
                                    {error || passwordError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 dark:bg-[#102323] border border-slate-200 dark:border-[#2f6a6a] rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="terms" required className="accent-primary size-4" />
                            <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400">
                                I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Medical Disclaimer</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-[#102323] font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Creating Account..." : "Create Free Account"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account? {' '}
                        <Link to="/signin" className="font-bold text-primary hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

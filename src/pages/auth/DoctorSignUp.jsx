import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export default function DoctorSignUp() {
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        clinicName: '',
        licenseId: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Register with role = 'doctor'
        const success = await signup(
            formData.name,
            formData.email,
            formData.password,
            'doctor',
            {
                clinicName: formData.clinicName,
                licenseId: formData.licenseId
            }
        );

        if (success) {
            navigate('/doctor-dashboard');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#0f2323]">
            {/* Left Side - Hero / Info */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-[#0f2323] relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8">
                        <span className="material-symbols-outlined text-5xl text-primary">medical_services</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6">
                        Empower Your Practice with <span className="text-primary">PhysioFix Pro</span>.
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Join thousands of innovative clinicians using AI to track patient recovery, visualize ROM data remotely, and improve outcomes.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-white">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">vital_signs</span>
                            </div>
                            <div>
                                <h3 className="font-bold">Real-time Biometrics</h3>
                                <p className="text-sm text-slate-400">Track patient form and pain instantly.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">encrypted</span>
                            </div>
                            <div>
                                <h3 className="font-bold">HIPAA Compliant</h3>
                                <p className="text-sm text-slate-400">Secure, encrypted patient data.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clinician Registration</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Create your professional account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">person</span>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Dr. Jane Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-[#2f6a6a] bg-white dark:bg-[#183535] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">mail</span>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="jane@clinic.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-[#2f6a6a] bg-white dark:bg-[#183535] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clinic Name</label>
                                    <input
                                        type="text"
                                        name="clinicName"
                                        required
                                        placeholder="City Physio"
                                        value={formData.clinicName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#2f6a6a] bg-white dark:bg-[#183535] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NPI / License ID</label>
                                    <input
                                        type="text"
                                        name="licenseId"
                                        required
                                        placeholder="123456789"
                                        value={formData.licenseId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-[#2f6a6a] bg-white dark:bg-[#183535] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">lock</span>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-[#2f6a6a] bg-white dark:bg-[#183535] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-[#0f2323] font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-[#0f2323] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Create Professional Account</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-primary font-bold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-xs text-slate-500 mt-4">
                                Not a provider? <Link to="/signup" className="text-slate-400 hover:text-white">Patient Sign Up</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { razorpayService } from '../../services/razorpayService';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function PricingModern() {
    const { user, upgradePlan } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(null); // 'pro' or 'clinic'

    const handleSubscribe = async (planId, amount) => {
        setIsLoading(planId);

        try {
            await razorpayService.openPaymentModal(
                planId,
                amount,
                user,
                (successData) => {
                    // On Success
                    console.log("Subscription Successful:", successData);
                    upgradePlan(planId);
                    alert(`Welcome to ${planId.toUpperCase()}! Your dashboard has been upgraded.`);
                    navigate('/dashboard');
                    setIsLoading(null);
                },
                (error) => {
                    // On Failure
                    console.error("Payment Failed:", error);
                    alert("Payment failed or cancelled. Please try again.");
                    setIsLoading(null);
                }
            );
        } catch (err) {
            console.error(err);
            setIsLoading(null);
        }
    };

    return (
        <div className="w-full bg-[#0f1014] py-24 px-6 relative" id="pricing">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Simple, Transparent <span className="text-primary">Pricing</span></h2>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto">Invest in your health for less than the cost of a single clinic visit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="rounded-3xl border border-white/10 bg-[#18191d]/80 p-8 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="mb-6"><span className="text-4xl font-black text-white">$0</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-slate-400 text-sm mb-8">Perfect for trying out the AI tracking.</p>
                        <button className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Current Plan</button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-300">
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> 3 Exercises / Day</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Basic AI Analysis</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-slate-600">close</span> No History</li>
                        </ul>
                    </div>

                    {/* Pro Plan (Highlighted) */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="rounded-3xl border-2 border-primary bg-[#131f24] p-10 relative shadow-[0_0_40px_rgba(5,204,204,0.15)] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-primary text-[#0f1014] text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
                        <h3 className="text-2xl font-bold text-white mb-2 text-primary">Pro Therapy</h3>
                        <div className="mb-6"><span className="text-5xl font-black text-white">$29</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-slate-300 text-sm mb-8">Full access to advanced rehab tools.</p>

                        <button
                            onClick={() => handleSubscribe('pro', 29)}
                            disabled={isLoading === 'pro'}
                            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-[#0f1014] font-bold shadow-lg transition-all flex justify-center items-center gap-2"
                        >
                            {isLoading === 'pro' ? (
                                <span className="size-5 border-2 border-[#0f1014] border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                "Upgrade to Pro"
                            )}
                        </button>

                        <ul className="mt-8 space-y-4 text-sm text-white">
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Unlimited Exercises</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Detailed skeletal reports</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Pain History & Trends</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Video Consults (2/mo)</li>
                        </ul>
                    </motion.div>

                    {/* Clinic Plan */}
                    <div className="rounded-3xl border border-white/10 bg-[#18191d]/80 p-8 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white mb-2">Clinic</h3>
                        <div className="mb-6"><span className="text-4xl font-black text-white">$99</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-slate-400 text-sm mb-8">For professional physiotherapists.</p>
                        <button
                            onClick={() => handleSubscribe('clinic', 99)}
                            disabled={isLoading === 'clinic'}
                            className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors flex justify-center items-center"
                        >
                            {isLoading === 'clinic' ? 'Processing...' : 'Start Clinic Trial'}
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-300">
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Manage 50+ Patients</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> Doctor Dashboard</li>
                            <li className="flex gap-3"><span className="material-symbols-outlined text-primary">check</span> White-label Reports</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

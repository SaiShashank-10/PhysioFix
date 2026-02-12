import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─────────────── 3D Feature Card ─────────────── */
function FeatureCard3D({ feature, index }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 25 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.06, z: 50 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-2xl overflow-hidden h-full"
            >
                {/* Moving shine */}
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, ${feature.glow || 'rgba(8,232,222,0.15)'}, transparent 50%)`
                    }}
                />
                {/* Animated border glow */}
                <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/30 via-transparent to-purple-500/30" />

                <motion.div
                    className={`size-16 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 flex items-center justify-center mb-6 shadow-lg`}
                    style={{ transform: 'translateZ(35px)' }}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="material-symbols-outlined text-4xl text-white">{feature.icon}</span>
                </motion.div>

                <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-2xl font-black text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
            </motion.div>
        </motion.div>
    );
}

/* ─────────────── Floating Particles ─────────────── */
function FloatingParticles() {
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        dur: Math.random() * 12 + 15,
        delay: Math.random() * 8,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        background: p.id % 3 === 0 ? 'rgba(136,85,255,0.25)' : 'rgba(8,232,222,0.25)',
                    }}
                    animate={{
                        y: [0, -120, 0],
                        x: [0, Math.random() * 60 - 30, 0],
                        opacity: [0.15, 0.45, 0.15],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}

/* ─────────────── Animated Counter ─────────────── */
function AnimatedCounter({ value, suffix = '', prefix = '' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [count, setCount] = useState(0);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const end = numericValue;
        const duration = 2000;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, numericValue]);

    return <span ref={ref}>{prefix}{isInView ? count : 0}{suffix}</span>;
}

/* ─────────────── 3D Pricing Card ─────────────── */
function PricingCard3D({ plan, index, popular }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 25 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative group ${popular ? 'lg:-mt-6' : ''}`}
            style={{ perspective: 1000 }}
        >
            {popular && (
                <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-primary to-cyan-400 rounded-full text-xs font-black text-black z-20 shadow-lg shadow-primary/40"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ✦ MOST POPULAR
                </motion.div>
            )}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.04, z: 30 }}
                className={`relative p-8 rounded-3xl border overflow-hidden shadow-2xl ${popular
                        ? 'bg-gradient-to-br from-primary/10 via-[#1a1d24] to-purple-500/10 border-primary/40'
                        : 'bg-gradient-to-br from-[#1a1d24] to-[#12151a] border-white/10'
                    }`}
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8,232,222,0.12), transparent 50%)`
                    }}
                />

                <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                    <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>

                    <div className="flex items-end gap-1 mb-8">
                        <span className="text-5xl font-black bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                            {plan.price}
                        </span>
                        {plan.period && <span className="text-slate-500 text-sm mb-2">/ {plan.period}</span>}
                    </div>

                    <ul className="space-y-3 mb-8">
                        {plan.features.map((f, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + i * 0.04 }}
                                className="flex items-center gap-3 text-sm text-slate-300"
                            >
                                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                {f}
                            </motion.li>
                        ))}
                    </ul>

                    <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: popular ? '0 0 30px rgba(8,232,222,0.5)' : 'none' }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full py-4 rounded-2xl font-black text-base transition-all ${popular
                                    ? 'bg-gradient-to-r from-primary to-cyan-400 text-black shadow-lg shadow-primary/30'
                                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                }`}
                        >
                            {plan.cta}
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─────────────── FAQ Accordion ─────────────── */
function FAQItem({ faq, index }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl"
        >
            <motion.button
                onClick={() => setOpen(!open)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-white pr-4">{faq.q}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    className="material-symbols-outlined text-primary flex-shrink-0"
                >
                    expand_more
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─────────────── Testimonial Card ─────────────── */
function TestimonialCard3D({ testimonial, index }) {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 25 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
            style={{ perspective: 800 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.03, z: 20 }}
                className="p-7 rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 shadow-xl overflow-hidden relative"
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(8,232,222,0.08), transparent 50%)`
                    }}
                />

                {/* Quote icon */}
                <div className="text-5xl font-black text-primary/20 leading-none mb-4" style={{ transform: 'translateZ(30px)' }}>"</div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10" style={{ transform: 'translateZ(15px)' }}>
                    {testimonial.quote}
                </p>

                <div className="flex items-center gap-4 relative z-10" style={{ transform: 'translateZ(15px)' }}>
                    <div className="size-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-black text-lg text-black shadow-lg">
                        {testimonial.name[0]}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-yellow-400 text-xs">star</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    /* Parallax transforms for hero */
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

    const features = [
        { icon: 'videocam', title: 'AI-Powered Analysis', description: 'Real-time computer vision tracks your movements with 95%+ accuracy and provides instant feedback on form and technique.', gradient: 'from-primary/30 to-cyan-500/30', glow: 'rgba(8,232,222,0.18)' },
        { icon: 'monitoring', title: 'Live Tele-Rehab', description: 'Connect with certified physiotherapists through HD video calls with AI overlay that highlights joints and angles.', gradient: 'from-purple-500/30 to-pink-500/30', glow: 'rgba(136,85,255,0.18)' },
        { icon: 'insights', title: 'Progress Tracking', description: 'Comprehensive analytics with motion heatmaps, ROM charts, and AI-generated recovery predictions.', gradient: 'from-green-500/30 to-emerald-500/30', glow: 'rgba(34,197,94,0.18)' },
        { icon: 'psychology', title: 'Personalized Plans', description: 'ML-generated routines that adapt based on your pain reporting, compliance patterns, and recovery velocity.', gradient: 'from-yellow-500/30 to-orange-500/30', glow: 'rgba(234,179,8,0.18)' },
        { icon: 'schedule', title: '24/7 Access', description: 'Practice exercises anytime with on-demand access, offline mode, and smart reminders for optimal recovery.', gradient: 'from-blue-500/30 to-indigo-500/30', glow: 'rgba(59,130,246,0.18)' },
        { icon: 'verified', title: 'Clinical Validation', description: 'Evidence-based exercises approved by 200+ medical professionals and validated in peer-reviewed research.', gradient: 'from-rose-500/30 to-red-500/30', glow: 'rgba(244,63,94,0.18)' },
    ];

    const howItWorks = [
        { step: '01', icon: 'person_add', title: 'Sign Up & Assess', desc: 'Create your profile and complete an AI-guided initial assessment of your condition and mobility.' },
        { step: '02', icon: 'smart_toy', title: 'Get AI Plan', desc: 'Our AI generates a personalized rehab plan with exercises tailored to your specific injury and goals.' },
        { step: '03', icon: 'fitness_center', title: 'Exercise with AI', desc: 'Perform exercises while our computer vision AI tracks your movement in real-time and corrects your form.' },
        { step: '04', icon: 'trending_up', title: 'Track & Recover', desc: 'Monitor your progress with detailed analytics, doctor consultations, and AI-adjusted routines.' },
    ];

    const testimonials = [
        { name: 'Sarah Johnson', role: 'ACL Recovery Patient', quote: 'PhysioFix transformed my recovery! The AI feedback helped me perfect my form during every exercise. My doctor was amazed at my progress — I recovered 3 weeks ahead of schedule.' },
        { name: 'Michael Chen', role: 'Post-Surgery Rehab', quote: 'Being able to do my rehab exercises at home with real-time AI guidance while connecting with my therapist remotely saved me countless hours of commuting. Truly revolutionary!' },
        { name: 'Dr. Emily Rodriguez', role: 'Physical Therapist', quote: 'As a clinician, PhysioFix allows me to monitor 3x more patients efficiently while maintaining quality care. The AI analytics give me insights I never had before.' },
        { name: 'James Park', role: 'Sports Injury Recovery', quote: 'The real-time form correction is like having a personal trainer 24/7. My shoulder ROM improved 40% in just 6 weeks. I cannot recommend PhysioFix enough!' },
    ];

    const plans = [
        { name: 'Starter', desc: 'For individual patients', price: 'Free', period: '', cta: 'Get Started Free', features: ['5 AI-tracked exercises', 'Basic progress tracking', 'Exercise video library', 'Email support'] },
        { name: 'Pro', desc: 'For serious recovery', price: '$19', period: 'month', cta: 'Start Pro Trial', features: ['Unlimited AI exercises', 'Advanced analytics', 'Live tele-rehab sessions', 'Doctor dashboard access', 'Priority support', 'Offline mode'] },
        { name: 'Clinic', desc: 'For healthcare providers', price: '$99', period: 'month', cta: 'Contact Sales', features: ['Multi-patient management', 'Custom exercise creation', 'White-label branding', 'HIPAA compliance', 'API access', 'Dedicated account manager'] },
    ];

    const faqs = [
        { q: 'How does the AI track my exercises?', a: 'PhysioFix uses advanced computer vision through your device camera to track 33 body keypoints in real-time. Our models detect joint angles, movement patterns, and exercise form with over 95% accuracy — no wearable sensors needed.' },
        { q: 'Is my medical data secure?', a: 'Absolutely. We follow HIPAA-compliant data handling, use end-to-end encryption, and never share your health data with third parties. Your video feed is processed locally and never stored on our servers.' },
        { q: 'Can I use PhysioFix without a doctor referral?', a: 'Yes! While PhysioFix works great with a doctor\'s supervision, anyone can sign up and use our AI-guided exercises for general wellness and mobility improvement.' },
        { q: 'What devices are supported?', a: 'PhysioFix works on any device with a modern web browser and camera — laptops, desktops, tablets, and smartphones. No app installation required.' },
        { q: 'How is this different from YouTube exercise videos?', a: 'Unlike passive videos, PhysioFix provides real-time AI feedback on YOUR specific form, tracks your progress over time, adapts your plan based on your recovery, and connects you with real clinicians.' },
    ];

    const stats = [
        { value: '10000', suffix: '+', label: 'Active Users' },
        { value: '98', suffix: '%', label: 'Success Rate' },
        { value: '500', suffix: '+', label: 'Exercises' },
        { value: '50', suffix: '+', label: 'Partner Clinics' },
    ];

    return (
        <div className="relative min-h-screen bg-[#0a0e12] text-white font-sans overflow-x-hidden selection:bg-primary/30">
            {/* Scroll progress */}
            <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-purple-500 origin-left z-[100]" />

            <FloatingParticles />

            {/* ── NAVBAR ── */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                className="fixed top-0 w-full z-50 bg-[#0a0e12]/80 backdrop-blur-2xl border-b border-white/5"
            >
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
                        <motion.div
                            className="size-11 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        >
                            <span className="material-symbols-outlined text-2xl text-black">health_and_safety</span>
                        </motion.div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">PhysioFix</span>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'How it Works', 'Pricing', 'Testimonials'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                                whileHover={{ scale: 1.08, y: -1 }}
                                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/signin">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm font-bold text-white hover:text-primary transition-colors hidden sm:block">
                                Log In
                            </motion.button>
                        </Link>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(8,232,222,0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-black font-black text-sm shadow-lg shadow-primary/30"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            <main>
                {/* ═══════ HERO ═══════ */}
                <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                    {/* 3 Animated orbs */}
                    <motion.div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
                        animate={{ scale: [1, 1.2, 1], x: [0, 60, 0], y: [0, -50, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
                        animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 50, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px]"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
                            >
                                <motion.span
                                    className="size-2 rounded-full bg-green-400"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="text-sm font-bold text-slate-300">AI-Powered Rehabilitation Platform</span>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-black">NEW</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tight">
                                <motion.span
                                    className="block bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                >
                                    Recovery
                                </motion.span>
                                <motion.span
                                    className="block bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, type: 'spring' }}
                                >
                                    Reimagined
                                </motion.span>
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                            >
                                The first web-based tele-rehab platform powered by{' '}
                                <strong className="text-white">real-time computer vision AI</strong>.
                                Get professional physiotherapy from anywhere in the world.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                            >
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(8,232,222,0.6)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-cyan-400 text-black font-black text-lg flex items-center gap-3 shadow-2xl shadow-primary/40"
                                    >
                                        Start Your Recovery
                                        <motion.span
                                            className="material-symbols-outlined text-2xl"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >arrow_forward</motion.span>
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05, borderColor: '#08e8de' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 rounded-2xl bg-white/5 border-2 border-white/15 backdrop-blur-xl text-white font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all"
                                >
                                    <span className="material-symbols-outlined text-2xl text-primary">play_circle</span>
                                    Watch Demo
                                </motion.button>
                            </motion.div>

                            {/* Hero floating UI mockup */}
                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, type: 'spring', stiffness: 60 }}
                                className="relative max-w-4xl mx-auto"
                            >
                                <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1d24] to-[#12151a] border border-white/10 p-6 shadow-2xl shadow-black/50">
                                    {/* Mock dashboard inside hero */}
                                    <div className="flex gap-2 mb-4">
                                        <div className="size-3 rounded-full bg-red-500/80" />
                                        <div className="size-3 rounded-full bg-yellow-500/80" />
                                        <div className="size-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        {stats.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1.3 + i * 0.1 }}
                                                className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"
                                            >
                                                <p className="text-xl font-black text-primary mb-1">
                                                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[75, 60, 85].map((val, i) => (
                                            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${val}%` }}
                                                        transition={{ duration: 1.5, delay: 1.5 + i * 0.15 }}
                                                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-primary to-cyan-400' : i === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-2">{['Range of Motion', 'Strength', 'Compliance'][i]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating elements around mockup */}
                                <motion.div
                                    className="absolute -top-6 -right-6 p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl shadow-xl"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                                        <span className="text-sm font-bold text-green-400">Form: Perfect!</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-4 -left-6 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-400/20 border border-primary/30 backdrop-blur-xl shadow-xl"
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">smart_toy</span>
                                        <span className="text-sm font-bold text-primary">AI Tracking Active</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                            <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </div>
                    </motion.div>
                </section>

                {/* ── Trusted by / logos ── */}
                <section className="py-16 px-6 border-y border-white/5">
                    <div className="max-w-[1400px] mx-auto">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center text-sm text-slate-500 mb-8 font-medium uppercase tracking-widest"
                        >
                            Trusted by leading healthcare institutions
                        </motion.p>
                        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
                            {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'Stanford Health', 'Mount Sinai'].map((name, i) => (
                                <motion.span
                                    key={name}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 0.35 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ opacity: 0.8, scale: 1.05 }}
                                    className="text-lg md:text-xl font-black text-white cursor-default"
                                >
                                    {name}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ FEATURES ═══════ */}
                <section id="features" className="relative py-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Why PhysioFix</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-4 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight">
                                Cutting-Edge Features
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Technology that adapts to you — not the other way around
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <FeatureCard3D key={i} feature={feature} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ HOW IT WORKS ═══════ */}
                <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Simple Process</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-4 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                How It Works
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Get started in minutes — recover in weeks
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Connecting line */}
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

                            {howItWorks.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, type: 'spring' }}
                                    className="relative text-center group"
                                >
                                    {/* Step number ring */}
                                    <motion.div
                                        className="size-20 rounded-full bg-gradient-to-br from-[#1a1d24] to-[#12151a] border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:border-primary transition-colors shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
                                    </motion.div>

                                    <span className="text-xs font-black text-primary/50 uppercase tracking-widest">Step {step.step}</span>
                                    <h3 className="text-xl font-black text-white mt-2 mb-3">{step.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Marquee ── */}
                <div className="w-full py-10 bg-gradient-to-r from-primary to-cyan-400 rotate-1 scale-110 border-y-4 border-[#0a0e12] overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[0, 1].map(copy => (
                            <div key={copy} className="flex gap-12 min-w-full shrink-0 px-6">
                                {[...Array(10)].map((_, i) => (
                                    <h2 key={`${copy}-${i}`} className="text-4xl md:text-5xl font-black text-black uppercase flex items-center gap-8">
                                        RECOVERY REIMAGINED <span className="text-white text-5xl md:text-6xl">✦</span>
                                    </h2>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════ TESTIMONIALS ═══════ */}
                <section id="testimonials" className="relative py-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Social Proof</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-4 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Loved by Thousands
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                See what patients and healthcare professionals are saying
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {testimonials.map((t, i) => (
                                <TestimonialCard3D key={i} testimonial={t} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ PRICING ═══════ */}
                <section id="pricing" className="relative py-32 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Pricing</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-4 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Start free. Scale as you grow. No hidden fees.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            {plans.map((plan, i) => (
                                <PricingCard3D key={i} plan={plan} index={i} popular={i === 1} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ FAQ ═══════ */}
                <section className="relative py-32 px-6">
                    <div className="max-w-[800px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="text-sm font-black text-primary uppercase tracking-widest">FAQ</span>
                            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Questions? Answers.
                            </h2>
                        </motion.div>

                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} faq={faq} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════ FINAL CTA ═══════ */}
                <section className="relative py-32 px-6 overflow-hidden">
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity }} />
                    <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[200px]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity }} />

                    <div className="relative z-10 max-w-[900px] mx-auto text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur mb-8"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                                <span className="text-sm font-bold text-slate-300">Join 10,000+ users recovering faster</span>
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white via-primary to-cyan-400 bg-clip-text text-transparent">
                                    Ready to Transform Your Recovery?
                                </span>
                            </h2>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Join thousands of patients who have accelerated their recovery with PhysioFix.
                                Start your journey to better health today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(8,232,222,0.7)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-cyan-400 text-black font-black text-xl shadow-2xl shadow-primary/50"
                                    >
                                        Get Started Free
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-xl text-white font-bold text-xl hover:bg-white/20 transition-all"
                                >
                                    Book a Demo
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════ FOOTER ═══════ */}
                <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-xl py-16">
                    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
                        <div className="max-w-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-11 bg-gradient-to-br from-primary to-cyan-400 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl text-black">health_and_safety</span>
                                </div>
                                <h2 className="text-2xl font-black">PhysioFix</h2>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                The first web-based tele-rehab platform powered by real-time computer vision AI. HIPAA compliant.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { icon: 'F', hover: 'hover:bg-blue-500/20 hover:border-blue-500/30' },
                                    { icon: 'X', hover: 'hover:bg-white/10 hover:border-white/20' },
                                    { icon: 'In', hover: 'hover:bg-blue-600/20 hover:border-blue-600/30' },
                                    { icon: 'Ig', hover: 'hover:bg-pink-500/20 hover:border-pink-500/30' },
                                ].map((social, i) => (
                                    <motion.a key={i} href="#" whileHover={{ scale: 1.15, y: -3 }} className={`size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${social.hover} transition-all`}>
                                        <span className="text-white text-xs font-bold">{social.icon}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { title: 'Product', links: ['Features', 'Pricing', 'For Clinics', 'API', 'Changelog'] },
                                { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Contact'] },
                                { title: 'Resources', links: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Case Studies'] },
                                { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'HIPAA', 'Cookies'] },
                            ].map((col) => (
                                <div key={col.title}>
                                    <h4 className="font-bold text-white mb-4">{col.title}</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        {col.links.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-[1400px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <p>© 2024 PhysioFix Inc. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

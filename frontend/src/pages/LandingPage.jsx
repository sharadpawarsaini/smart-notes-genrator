import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, CheckCircle, ArrowRight, Star, Users, Brain, Play, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="hero-glow"></div>
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <motion.div 
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">The Ultimate AI Study Tool</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                        Turn PDFs into <span className="gradient-text">Exam-Ready Notes</span> in Seconds
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Upload your syllabus, lecture notes, or textbooks and get structured summaries, flashcards, and practice quizzes instantly. Stop reading, start mastering.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="bg-primary hover:bg-primary-dark text-white text-lg font-bold px-10 py-5 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                            Try for Free <ArrowRight size={20} />
                        </Link>
                        <Link to="/upload" className="bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold px-10 py-5 rounded-xl transition-all border border-slate-700 flex items-center gap-2">
                            <FileText size={20} /> Upload PDF
                        </Link>
                    </div>
                    
                    <div className="mt-16 flex items-center justify-center gap-8 text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Users size={18} /> 5,000+ Students
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={18} className="text-yellow-500 fill-yellow-500" /> 4.9/5 Rating
                        </div>
                    </div>
                </motion.div>

                {/* Demo Mockup */}
                <motion.div 
                    className="relative max-w-5xl mx-auto mb-32"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                >
                    <div className="glass-card rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-6 border-b border-slate-700/50 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-4 bg-slate-800/50 px-4 py-1 rounded text-xs text-slate-500 font-mono">notegenie-ai.app/demo/dsa-notes</div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                <div className="flex items-center gap-2 text-primary mb-4 font-bold text-sm uppercase">
                                    <FileText size={16} /> Input Document
                                </div>
                                <div className="space-y-3 opacity-60">
                                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-700 rounded w-4/5"></div>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-6 border border-primary/30 relative">
                                <div className="flex items-center gap-2 text-secondary mb-4 font-bold text-sm uppercase">
                                    <Zap size={16} /> AI Generated Notes
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-2 bg-secondary/40 rounded w-1/3"></div>
                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    </div>
                                    <div className="space-y-2 pl-4 border-l-2 border-secondary/20">
                                        <div className="h-2 bg-slate-700 rounded w-full"></div>
                                        <div className="h-2 bg-slate-700 rounded w-5/6"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] rounded uppercase font-bold tracking-wider border border-secondary/20">Summary</div>
                                        <div className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] rounded uppercase font-bold tracking-wider border border-purple-500/20">Flashcards</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40"></div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    className="grid md:grid-cols-4 gap-6 mb-32"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        { icon: <Brain />, title: "Smart Summary", desc: "Complex concepts simplified into easy-to-read bullet points." },
                        { icon: <Zap />, title: "Flashcards", desc: "Auto-generate study cards to help you memorize faster." },
                        { icon: <Play />, title: "Video Summaries", desc: "Paste a YouTube link and get notes from lectures instantly." },
                        { icon: <Download />, title: "PDF Export", desc: "Download your beautifully formatted notes for offline study." },
                    ].map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            variants={itemVariants}
                            className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all group"
                        >
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Pricing Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Simple, Student-Friendly Pricing</h2>
                        <p className="text-slate-400">Invest in your grades today.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
                        <div className="flex-1 glass-card p-10 rounded-3xl border border-slate-800">
                            <h4 className="text-xl font-bold mb-2">Free Learner</h4>
                            <p className="text-slate-500 mb-6 text-sm italic">For basic summarization</p>
                            <p className="text-5xl font-extrabold mb-8 text-white">₹0<span className="text-lg text-slate-500 font-normal">/month</span></p>
                            <ul className="text-left space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={18} className="text-secondary" /> 3 notes per day</li>
                                <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={18} className="text-secondary" /> AI Summaries</li>
                                <li className="flex items-center gap-3 text-slate-400 line-through opacity-30"><CheckCircle size={18} className="text-secondary" /> PDF Export</li>
                                <li className="flex items-center gap-3 text-slate-400 line-through opacity-30"><CheckCircle size={18} className="text-secondary" /> YouTube Summaries</li>
                            </ul>
                            <Link to="/register" className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition text-center">Get Started</Link>
                        </div>
                        <div className="flex-1 glass-card p-10 rounded-3xl border-2 border-primary relative overflow-hidden transform scale-105 shadow-2xl shadow-primary/20">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl tracking-wider">BEST VALUE</div>
                            <h4 className="text-xl font-bold mb-2">Exam Pro</h4>
                            <p className="text-slate-500 mb-6 text-sm italic">For serious students</p>
                            <p className="text-5xl font-extrabold mb-8 text-white">₹99<span className="text-lg text-slate-500 font-normal">/month</span></p>
                            <ul className="text-left space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-slate-200"><CheckCircle size={18} className="text-secondary" /> Unlimited AI Notes</li>
                                <li className="flex items-center gap-3 text-slate-200"><CheckCircle size={18} className="text-secondary" /> Unlimited PDF Exports</li>
                                <li className="flex items-center gap-3 text-slate-200"><CheckCircle size={18} className="text-secondary" /> Flashcards & Quizzes</li>
                                <li className="flex items-center gap-3 text-slate-200"><CheckCircle size={18} className="text-secondary" /> YouTube Video Notes</li>
                                <li className="flex items-center gap-3 text-slate-200"><CheckCircle size={18} className="text-secondary" /> Priority AI Models</li>
                            </ul>
                            <Link to="/register" className="block w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/30 text-center">Upgrade to Pro</Link>
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="bg-slate-900/40 rounded-3xl p-12 border border-slate-800 text-center">
                    <h3 className="text-2xl font-bold mb-10">Trusted by students from</h3>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50 contrast-125 mb-16">
                        <div className="text-3xl font-black italic tracking-tighter">IIT BOMBAY</div>
                        <div className="text-3xl font-black italic tracking-tighter">BITS PILANI</div>
                        <div className="text-3xl font-black italic tracking-tighter">VIT VELLORE</div>
                        <div className="text-3xl font-black italic tracking-tighter">SRM</div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { name: "Rahul S.", role: "Engineering Student", text: "Saved me at least 10 hours a week. The summaries are actually smart, not just randomly picked sentences." },
                            { name: "Priya M.", role: "Medical Student", text: "Converting heavy textbook PDFs into flashcards instantly is a game changer for my exam prep." },
                            { name: "Amit K.", role: "CA Aspirant", text: "NoteGenie is my secret weapon for clearing concepts from long audit documents." }
                        ].map((review, i) => (
                            <div key={i} className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-slate-300 text-sm mb-6 italic">"{review.text}"</p>
                                <div className="font-bold">{review.name}</div>
                                <div className="text-xs text-slate-500">{review.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
                <p>© 2024 NoteGenie AI. Made for students by builders.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-20">
                <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    NoteGenie AI: Your PDF, Mastered.
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    NoteGenie uses advanced AI to magically transform long PDFs into smart notes, key concepts, and study questions in seconds.
                </p>
                <Link to="/register" className="bg-primary hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
                    Get Started for Free
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-primary/50 transition">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                        <FileText className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">PDF Summarization</h3>
                    <p className="text-slate-400">Extract the essence of any document in seconds. No more reading hundreds of pages.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-primary/50 transition">
                    <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                        <Zap className="text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Question Generator</h3>
                    <p className="text-slate-400">Perfect for students. Automatically generate practice questions from your notes.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-primary/50 transition">
                    <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                        <Shield className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Secure Storage</h3>
                    <p className="text-slate-400">Your documents and notes are stored securely and accessible only to you.</p>
                </div>
            </div>

            <div className="bg-slate-800 rounded-3xl p-12 border border-slate-700 text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8">Simple Pricing</h2>
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className="flex-1 bg-slate-900 p-8 rounded-2xl border border-slate-700">
                        <h4 className="text-xl font-bold mb-2">Free</h4>
                        <p className="text-4xl font-extrabold mb-6">₹0<span className="text-lg text-slate-400 font-normal">/month</span></p>
                        <ul className="text-left space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={18} className="text-secondary" /> 3 PDFs per month</li>
                            <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={18} className="text-secondary" /> Basic Summaries</li>
                            <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={18} className="text-secondary" /> Key Points</li>
                        </ul>
                        <Link to="/register" className="block w-full py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition">Start Free</Link>
                    </div>
                    <div className="flex-1 bg-slate-900 p-8 rounded-2xl border-2 border-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <h4 className="text-xl font-bold mb-2">Pro</h4>
                        <p className="text-4xl font-extrabold mb-6">₹49<span className="text-lg text-slate-400 font-normal">/month</span></p>
                        <ul className="text-left space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-slate-300"><CheckCircle size={18} className="text-secondary" /> Unlimited PDFs</li>
                            <li className="flex items-center gap-2 text-slate-300"><CheckCircle size={18} className="text-secondary" /> Detailed AI Notes</li>
                            <li className="flex items-center gap-2 text-slate-300"><CheckCircle size={18} className="text-secondary" /> Question Generation</li>
                            <li className="flex items-center gap-2 text-slate-300"><CheckCircle size={18} className="text-secondary" /> Priority Support</li>
                        </ul>
                        <button className="block w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-primary/30">Get Pro</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

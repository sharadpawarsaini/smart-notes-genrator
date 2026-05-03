import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notesService, authService } from '../services/api';
import { 
    FileText, Calendar, ArrowRight, Plus, Search, Tag, 
    Folder, Trash2, Clock, Star, Zap, CheckCircle2, 
    CreditCard, Smartphone, ShieldCheck, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PricingModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [step, setStep] = useState('pricing'); // 'pricing' or 'payment'
    const [paying, setPaying] = useState(false);

    if (!isOpen) return null;

    const handleRazorpay = async () => {
        setPaying(true);
        try {
            // 1. Create Order on Backend
            const orderRes = await notesService.createOrder();
            const order = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Use env var
                amount: order.amount,
                currency: order.currency,
                name: 'NoteGenie AI',
                description: 'Pro Subscription',
                order_id: order.id,
                handler: async (response) => {
                    // 2. Verify Payment on Backend
                    try {
                        const verifyRes = await notesService.verifyPayment(response);
                        if (verifyRes.data.success) {
                            onPaymentSuccess();
                            alert('Welcome to Genie Pro! Your account has been upgraded.');
                            onClose();
                        }
                    } catch (err) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: 'Student User',
                    email: 'user@example.com'
                },
                theme: { color: '#3b82f6' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment Initialization Failed', err);
            alert('Failed to start payment process.');
        } finally {
            setPaying(false);
        }
    };

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            features: ['20 Notes / Month', 'Standard Flowcharts', 'AI Quiz Buddy', 'PDF Export'],
            button: 'Current Plan',
            disabled: true,
            color: 'slate'
        },
        {
            name: 'Genie Pro',
            price: '₹59',
            period: '/month',
            features: ['Unlimited Notes', 'Ultra-Detailed Flowcharts', 'Advanced AI Tutor', 'Priority Support', 'No Ads'],
            button: 'Upgrade Now',
            popular: true,
            color: 'primary'
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"><X size={28} /></button>
                    
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="bg-primary/10 p-12 md:w-1/3 flex flex-col justify-center border-r border-slate-800">
                            <Zap className="text-primary mb-6" size={48} />
                            <h3 className="text-3xl font-bold mb-4">Unleash the Full Power</h3>
                            <p className="text-slate-400 leading-relaxed">Join 5,000+ students who are mastering their subjects with Genie Pro.</p>
                        </div>

                        <div className="p-12 flex-1 overflow-y-auto max-h-[80vh]">
                            {step === 'pricing' ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {plans.map((plan, i) => (
                                        <div key={i} className={`p-8 rounded-3xl border-2 transition-all ${plan.popular ? 'border-primary bg-primary/5' : 'border-slate-800 bg-slate-800/50'}`}>
                                            {plan.popular && <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Most Popular</span>}
                                            <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                                            <div className="flex items-end gap-1 mb-6">
                                                <span className="text-4xl font-black">{plan.price}</span>
                                                {plan.period && <span className="text-slate-500 mb-1">{plan.period}</span>}
                                            </div>
                                            <ul className="space-y-4 mb-8">
                                                {plan.features.map((f, j) => (
                                                    <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                                                        <CheckCircle2 size={18} className="text-primary" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button 
                                                disabled={plan.disabled}
                                                onClick={() => setStep('payment')}
                                                className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.disabled ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20'}`}
                                            >
                                                {plan.button}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <button onClick={() => setStep('pricing')} className="text-primary hover:underline font-bold text-sm">← Back to Pricing</button>
                                    <h4 className="text-3xl font-bold">Safe & Secure Payment</h4>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-slate-400">Genie Pro (1 Month)</span>
                                            <span className="font-bold">₹59.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold border-t border-slate-700 pt-4">
                                            <span>Total Amount</span>
                                            <span className="text-primary">₹59.00</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        disabled={paying}
                                        onClick={handleRazorpay}
                                        className="w-full bg-primary hover:bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {paying ? <><Loader2 className="animate-spin" /> Starting Secure Payment...</> : <><Smartphone size={24} /> Pay via UPI / Cards</>}
                                    </button>
                                    <p className="text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                                        <ShieldCheck size={14} /> Secured by Razorpay SSL Encryption
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [showPricing, setShowPricing] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchNotes();
        fetchUser();
        
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const fetchUser = async () => {
        try {
            const res = await authService.getMe();
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch user profile');
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await notesService.getNotes();
            setNotes(res.data);
            setFilteredNotes(res.data);
        } catch (err) {
            console.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = notes;
        if (searchQuery) {
            result = result.filter(n => 
                n.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.summary.short.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedTag !== 'All') {
            result = result.filter(n => n.tags?.includes(selectedTag));
        }
        setFilteredNotes(result);
    }, [searchQuery, selectedTag, notes]);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;
        
        try {
            await notesService.deleteNote(id);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            alert('Failed to delete note');
        }
    };

    const allTags = ['All', ...new Set(notes.flatMap(n => n.tags || []))];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <PricingModal 
                isOpen={showPricing} 
                onClose={() => setShowPricing(false)} 
                onPaymentSuccess={() => {
                    fetchUser();
                    fetchNotes();
                }}
            />

            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold flex items-center gap-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        <Folder className="text-primary" size={36} /> My Magic Library
                    </h2>
                    <p className="text-slate-400 mt-2 text-lg">You have {notes.length} AI-powered notes in your collection.</p>
                </div>
                <div className="flex gap-4">
                    {user && !user.isSubscribed && (
                        <button 
                            onClick={() => setShowPricing(true)}
                            className="bg-slate-800 hover:bg-slate-700 text-yellow-400 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all border border-yellow-500/20"
                        >
                            <Zap size={24} />
                            Go Pro
                        </button>
                    )}
                    {user?.isSubscribed && (
                        <div className="bg-primary/10 text-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-2 border border-primary/20">
                            <ShieldCheck size={24} />
                            Genie Pro Active
                        </div>
                    )}
                    <Link to="/upload" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-primary/30">
                        <Plus size={24} />
                        Create New Note
                    </Link>
                </div>
            </div>

            {/* Quick Stats / Usage Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-2xl">
                            <Clock className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Recent Activity</p>
                            <p className="text-white font-bold">Updated {notes.length > 0 ? 'Just now' : 'Never'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-500/10 p-3 rounded-2xl">
                            <Tag className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Tags</p>
                            <p className="text-white font-bold">{allTags.length - 1} Categories</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-yellow-500/20 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group cursor-pointer" onClick={() => !user?.isSubscribed && setShowPricing(true)}>
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-all"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-500/10 p-3 rounded-2xl">
                                <Zap className="text-yellow-400" size={20} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Monthly Usage</p>
                                <p className="text-white font-bold">{user?.isSubscribed ? 'Unlimited' : `${notes.length} / 20 Notes`}</p>
                            </div>
                        </div>
                        {!user?.isSubscribed && <ChevronRight className="text-slate-600 group-hover:text-yellow-400 transition-all" />}
                    </div>
                    {!user?.isSubscribed && (
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${Math.min((notes.length / 20) * 100, 100)}%` }}></div>
                        </div>
                    )}
                    {user?.isSubscribed && (
                        <p className="text-[10px] text-primary uppercase font-black tracking-widest">Premium Features Enabled</p>
                    )}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
                    <input 
                        type="text" 
                        placeholder="Search your library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all shadow-inner text-lg"
                    />
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-6 py-3 rounded-xl border whitespace-nowrap transition-all font-medium ${selectedTag === tag ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            ) : filteredNotes.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-32 bg-slate-800/30 rounded-[3rem] border-2 border-dashed border-slate-700/50"
                >
                    <div className="bg-slate-700/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FileText className="text-slate-500" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Your library is empty</h3>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto text-lg">Start your journey by uploading your first PDF and let the Genie do its magic.</p>
                    <Link to="/upload" className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all inline-block shadow-lg shadow-primary/20">
                        Upload a PDF
                    </Link>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredNotes.map((note) => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <Link 
                                    to={`/notes/${note._id}`}
                                    className="bg-slate-800/80 border border-slate-700/50 rounded-[2.5rem] p-8 block transition-all hover:border-primary/50 hover:bg-slate-800 shadow-xl group overflow-hidden"
                                >
                                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                                    
                                    <div className="flex items-start justify-between mb-6 relative">
                                        <div className="bg-primary/20 p-4 rounded-2xl group-hover:bg-primary transition-all">
                                            <FileText className="text-primary group-hover:text-white" size={28} />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="flex gap-2">
                                                {note.tags?.slice(0, 2).map(t => (
                                                    <span key={t} className="text-[10px] bg-slate-900 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter border border-slate-700">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-all">{note.originalFileName}</h3>
                                    <p className="text-slate-400 text-base line-clamp-2 mb-8 leading-relaxed">
                                        {note.summary.short}
                                    </p>
                                    
                                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-6">
                                        <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
                                            Open Note <ArrowRight size={18} className="ml-1" />
                                        </div>
                                        <button 
                                            onClick={(e) => handleDelete(e, note._id)}
                                            className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete Note"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Dashboard;

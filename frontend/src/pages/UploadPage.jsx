import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesService, authService } from '../services/api';
import { Upload, File, X, AlertCircle, Loader2, Play, ArrowRight, Brain, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
    const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' or 'youtube'
    const [file, setFile] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, generating, error
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authService.getMe();
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user');
            }
        };
        fetchUser();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid PDF file.');
        }
    };

    const handleUpload = async () => {
        if (activeTab === 'pdf' && !file) return;
        if (activeTab === 'youtube' && !youtubeUrl) return;

        setStatus(activeTab === 'pdf' ? 'uploading' : 'generating');
        setError('');
        
        try {
            let notesRes;
            if (activeTab === 'pdf') {
                const formData = new FormData();
                formData.append('pdf', file);

                // 1. Upload and Extract Text
                const uploadRes = await notesService.uploadPDF(formData);
                const { extractedText, fileName } = uploadRes.data;

                setStatus('generating');
                
                // 2. Generate Notes with AI
                notesRes = await notesService.generateNotes({ extractedText, fileName });
            } else {
                // YouTube Logic
                notesRes = await notesService.generateYouTubeNotes(youtubeUrl);
            }
            
            navigate(`/notes/${notesRes.data._id}`);
        } catch (err) {
            setStatus('error');
            const message = err.response?.data?.message || 'Something went wrong during processing.';
            setError(message);
            
            if (err.response?.status === 403) {
                setError('Limit reached! Upgrade to Genie Pro to generate more notes.');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 relative">
            <div className="hero-glow !opacity-10"></div>
            
            <div className="text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
                >
                    Create Your Study Magic
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg"
                >
                    Choose your source and let NoteGenie build your knowledge base.
                </motion.p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-10">
                <div className="bg-slate-800/50 p-1 rounded-2xl border border-slate-700 flex gap-2">
                    <button 
                        onClick={() => { setActiveTab('pdf'); setStatus('idle'); }}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'pdf' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <File size={20} /> PDF Document
                    </button>
                        <button 
                            onClick={() => { setActiveTab('youtube'); setStatus('idle'); }}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'youtube' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Play size={20} /> YouTube Video
                        </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'pdf' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'pdf' ? 20 : -20 }}
                    className="glass-card p-12 rounded-[2.5rem] border border-slate-700/50 shadow-2xl"
                >
                    {activeTab === 'pdf' ? (
                        <div className="text-center">
                            {!file ? (
                                <div className="relative group cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-4 border-dashed border-slate-700 group-hover:border-primary/50 transition-all rounded-[2rem] py-20 bg-slate-900/30">
                                        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">
                                            <Upload className="text-primary" size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">Drop your PDF here</h3>
                                        <p className="text-slate-500 mb-2">or click to browse your files</p>
                                        <p className="text-xs text-slate-600 uppercase tracking-widest font-black mt-6">Maximum 25MB • Standard PDF</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="bg-secondary/10 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                                        <File className="text-secondary" size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3">{file.name}</h3>
                                    <p className="text-slate-500 mb-10">Ready to transform {(file.size / 1024 / 1024).toFixed(2)} MB of knowledge.</p>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setFile(null)}
                                            className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition border border-slate-700"
                                        >
                                            <X size={20} /> Remove
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            className="bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold transition shadow-xl shadow-primary/30 flex items-center gap-2"
                                        >
                                            <Zap size={20} /> Generate Notes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto">
                                <Play className="text-red-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Video Summarization</h3>
                            <p className="text-slate-500 mb-10">Paste a YouTube URL to generate notes from lecture or educational videos.</p>
                            
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                                    <input 
                                        type="text" 
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-red-500/50 transition-all text-lg shadow-inner"
                                    />
                                </div>
                                <button
                                    onClick={handleUpload}
                                    disabled={!youtubeUrl}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    <Brain size={24} /> Summarize Video <ArrowRight size={24} />
                                </button>
                                <p className="text-xs text-slate-600 uppercase tracking-widest font-black">Pro Feature • Instant Processing</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Processing Overlay */}
            <AnimatePresence>
                {(status === 'uploading' || status === 'generating') && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="relative mb-12">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="text-primary animate-pulse" size={48} />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black mb-4">
                            {status === 'uploading' ? 'Extracting Knowledge...' : 'Genie is Thinking...'}
                        </h3>
                        <p className="text-slate-400 text-xl max-w-md leading-relaxed">
                            {status === 'uploading' 
                                ? 'We are parsing your document to find the most important concepts.' 
                                : 'Our AI is structuring your notes, creating flashcards, and generating quiz questions.'}
                        </p>
                        <div className="mt-12 w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 15, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {status === 'error' && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 glass-card border-red-500/30 p-8 rounded-[2rem] flex flex-col items-center gap-4 text-center"
                >
                    <div className="bg-red-500/10 p-4 rounded-full">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-red-500 mb-1">Magic Failed</h4>
                        <p className="text-slate-400">{error}</p>
                    </div>
                    <button
                        onClick={() => setStatus('idle')}
                        className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl font-bold transition-all mt-2"
                    >
                        Try Again
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default UploadPage;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Download, ChevronLeft, BookOpen, Lightbulb, 
    HelpCircle, Hash, MessageSquare, RotateCw, 
    Send, FileText, Volume2, VolumeX, 
    BrainCircuit, CheckCircle2, Trash2, Trophy, Loader2,
    Zap, Compass, LayoutList, Lock
} from 'lucide-react';
import { notesService, authService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';
import html2pdf from 'html2pdf.js';

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter',
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
});

const Mermaid = ({ chart }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (chart && ref.current) {
            // Clean common AI mistakes in Mermaid code
            let cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();
            if (!cleanChart.startsWith('graph')) {
                cleanChart = 'graph TD\n' + cleanChart;
            }
            ref.current.innerHTML = cleanChart;
            ref.current.removeAttribute('data-processed');
            mermaid.contentLoaded();
        }
    }, [chart]);
    return <div key={chart} className="mermaid flex justify-center w-full" ref={ref}></div>;
};

const NotesViewer = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('notes'); 
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);
    const [gradingLoading, setGradingLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [user, setUser] = useState(null);
    
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await notesService.getNoteById(id);
                setNote(res.data);
                if (res.data.flashcards?.length > 0) {
                    setChatMessages([{ role: 'ai', content: `Hi! I'm NoteGenie. I've analyzed "${res.data.originalFileName}". You can ask me anything about it!` }]);
                }
            } catch (err) {
                console.error('Failed to fetch note');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await authService.getMe();
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user');
            }
        };

        fetchNote();
        fetchUser();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleDownload = () => {
        if (!user?.isSubscribed) {
            alert('PDF Export is a Pro feature. Please upgrade to Genine Pro in the dashboard to download notes.');
            return;
        }

        const element = document.getElementById('printable-content');
        if (!element) return;
        
        setDownloading(true);
        const opt = {
            margin: [10, 10],
            filename: `${note.originalFileName.split('.')[0]}_Notes.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#0f172a', // Preserve dark mode look
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            setDownloading(false);
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await notesService.deleteNote(id);
                navigate('/dashboard');
            } catch (err) {
                alert('Failed to delete note');
            }
        }
    };

    const toggleSpeech = (text) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const handleChat = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || chatLoading) return;
        const message = userInput;
        setUserInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
        setChatLoading(true);
        try {
            const res = await notesService.chatWithNote(id, message);
            setChatMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to AI Genie.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleQuizSubmit = async () => {
        setGradingLoading(true);
        try {
            const res = await notesService.gradeQuiz(id, quizAnswers);
            setQuizResults(res.data);
        } catch (err) {
            alert('Grading failed. Please try again.');
        } finally {
            setGradingLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!note) return null;

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 print:hidden">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                    <ChevronLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex flex-wrap justify-center bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-lg">
                    {['notes', 'flashcards', 'mindmap', 'quiz', 'chat'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg transition capitalize text-sm md:text-base ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {tab === 'mindmap' ? 'Flowchart' : tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'notes' && (
                    <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} id="printable-content" className="bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
                        <div className="bg-primary p-10 text-white flex justify-between items-center print:bg-slate-100 print:text-black print:border-b">
                            <div><h1 className="text-4xl font-bold mb-2">{note.originalFileName}</h1><p className="opacity-80 text-lg">Generated on {new Date(note.createdAt).toLocaleDateString()}</p></div>
                            <div className="flex gap-3">
                                <button onClick={() => toggleSpeech(note.summary.detailed)} className={`p-4 rounded-2xl transition print:hidden ${isSpeaking ? 'bg-secondary text-white' : 'bg-white/10 hover:bg-white/20'}`}>{isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
                                <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/30 p-4 rounded-2xl transition text-red-400 print:hidden border border-red-500/20"><Trash2 size={24} /></button>
                                <button 
                                    onClick={handleDownload} 
                                    disabled={downloading} 
                                    className={`p-4 rounded-2xl transition print:hidden disabled:opacity-50 relative group ${!user?.isSubscribed ? 'bg-slate-700/50 text-slate-500' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    {downloading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                                    {!user?.isSubscribed && (
                                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-slate-900 rounded-full p-1 border-2 border-slate-900 group-hover:scale-110 transition-all">
                                            <Lock size={10} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="p-10 space-y-16">
                            {/* Summary */}
                            <section>
                                <div className="flex items-center gap-4 mb-8 text-primary print:text-blue-700"><BookOpen size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Summary</h2></div>
                                <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50 print:bg-slate-50 print:border-slate-200"><p className="text-2xl font-semibold mb-6 text-slate-100 leading-snug print:text-black">{note.summary.short}</p><div className="h-px bg-slate-700/50 my-8 print:bg-slate-200"></div><p className="text-slate-400 text-lg leading-relaxed print:text-slate-700">{note.summary.detailed}</p></div>
                            </section>

                            {/* Glossary - NEW */}
                            {note.glossary && note.glossary.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8 text-blue-400 print:text-blue-700"><LayoutList size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Glossary</h2></div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {note.glossary.map((item, i) => (
                                            <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                                                <p className="font-bold text-blue-400 mb-2">{item.term}</p>
                                                <p className="text-slate-400 text-sm">{item.definition}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Practical Applications - NEW */}
                            {note.practicalApplications && note.practicalApplications.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8 text-orange-400 print:text-orange-700"><Zap size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Applications</h2></div>
                                    <div className="space-y-4">
                                        {note.practicalApplications.map((app, i) => (
                                            <div key={i} className="bg-orange-500/5 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                                                <p className="text-slate-200 text-lg">{app}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Critical Thinking - NEW */}
                            {note.criticalThinking && note.criticalThinking.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8 text-green-400 print:text-green-700"><Compass size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Deep Study</h2></div>
                                    <ul className="space-y-4">
                                        {note.criticalThinking.map((prompt, i) => (
                                            <li key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex gap-4">
                                                <span className="text-green-400 font-bold">#</span>
                                                <p className="text-slate-300 text-lg">{prompt}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Key Points */}
                            <section>
                                <div className="flex items-center gap-4 mb-8 text-secondary print:text-green-700"><Lightbulb size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Key Points</h2></div>
                                <ul className="grid md:grid-cols-2 gap-6">{note.keyPoints.map((point, index) => (<li key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex gap-4 print:bg-white print:border-slate-200"><span className="text-secondary font-black text-xl">0{index + 1}</span><p className="text-slate-300 text-lg print:text-black">{point}</p></li>))}</ul>
                            </section>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'mindmap' && (
                    <motion.div key="mindmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-[2.5rem] border border-slate-700 p-10 flex flex-col items-center min-h-[500px]">
                        <div className="flex items-center gap-4 mb-10 text-primary self-start"><BrainCircuit size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Process Flowchart</h2></div>
                        {note.mindMapCode ? (<div className="w-full bg-slate-900/50 rounded-[2rem] p-10 overflow-auto border border-slate-700/50 scrollbar-hide"><Mermaid chart={note.mindMapCode} /></div>) : (<div className="text-center py-32 bg-slate-900/50 w-full rounded-[2rem] border border-slate-700/50"><p className="text-slate-400 text-xl mb-4">Flowchart not available.</p></div>)}
                    </motion.div>
                )}

                {activeTab === 'quiz' && (
                    <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800 rounded-[2.5rem] border border-slate-700 p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4 text-yellow-500"><HelpCircle size={32} /><h2 className="text-3xl font-bold uppercase tracking-widest">Study Buddy Quiz</h2></div>
                            {quizResults && (<button onClick={() => { setQuizResults(null); setQuizAnswers({}); }} className="text-primary hover:underline font-bold text-lg">Retake Quiz</button>)}
                        </div>
                        {quizResults ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-[2rem] text-center shadow-xl"><Trophy size={64} className="mx-auto mb-4 text-yellow-400" /><h3 className="text-4xl font-black mb-2">Final Score: {quizResults.averageScore}%</h3><p className="text-xl opacity-90">{quizResults.overallFeedback}</p></div>
                                <div className="space-y-6">
                                    {quizResults.scores.map((res, i) => (
                                        <div key={i} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50">
                                            <div className="flex justify-between items-start mb-4"><p className="text-xl font-bold flex gap-3"><span className="text-yellow-500">Q{i+1}</span> {note.importantQuestions[i]}</p><span className={`px-4 py-1 rounded-full font-bold ${res.score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{res.score}%</span></div>
                                            <p className="text-slate-400 italic mb-4">Your Answer: "{quizAnswers[i]}"</p><p className="text-slate-200 bg-slate-800 p-4 rounded-xl border border-slate-700">{res.feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-10">
                                {note.importantQuestions.map((q, i) => (
                                    <div key={i} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700/50"><p className="text-xl font-bold mb-6 flex gap-4"><span className="text-yellow-500">Q{i+1}</span> {q}</p><textarea placeholder="Type your answer here..." value={quizAnswers[i] || ''} onChange={(e) => setQuizAnswers(prev => ({ ...prev, [i]: e.target.value }))} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-5 focus:outline-none focus:border-yellow-500/50 transition-all h-32 text-lg" /></div>
                                ))}
                                <button onClick={handleQuizSubmit} disabled={gradingLoading || Object.keys(quizAnswers).length === 0} className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">{gradingLoading ? <><Loader2 className="animate-spin" size={28} /> Genie is Grading...</> : <><CheckCircle2 size={28} /> Submit & Get Score</>}</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'flashcards' && (
                    <motion.div key="flashcards" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-2xl mx-auto">
                        {note.flashcards?.length > 0 ? (
                            <div className="flex flex-col items-center">
                                <div className="relative w-full h-[400px] cursor-pointer perspective-1000 mb-12" onClick={() => setIsFlipped(!isFlipped)}>
                                    <motion.div className="w-full h-full relative" initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}>
                                        <div className="absolute inset-0 bg-slate-800 border-4 border-primary rounded-[3rem] p-12 flex flex-col items-center justify-center text-center backface-hidden shadow-2xl"><span className="text-primary font-black mb-6 uppercase tracking-[0.2em] text-sm">Question</span><h3 className="text-3xl font-bold leading-tight">{note.flashcards[currentCard].question}</h3><div className="absolute bottom-8 text-slate-500 flex items-center gap-3 text-sm font-bold"><RotateCw size={18} /> CLICK TO REVEAL</div></div>
                                        <div className="absolute inset-0 bg-primary rounded-[3rem] p-12 flex flex-col items-center justify-center text-center backface-hidden shadow-2xl" style={{ transform: 'rotateY(180deg)' }}><span className="text-white/60 font-black mb-6 uppercase tracking-[0.2em] text-sm">Correct Answer</span><p className="text-2xl font-bold leading-relaxed">{note.flashcards[currentCard].answer}</p></div>
                                    </motion.div>
                                </div>
                                <div className="flex items-center gap-10"><button disabled={currentCard === 0} onClick={() => { setCurrentCard(c => c - 1); setIsFlipped(false); }} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 disabled:opacity-30 hover:bg-slate-700 transition-all shadow-xl"><ChevronLeft size={32} /></button><span className="text-slate-400 font-black text-2xl tracking-tighter">{currentCard + 1} / {note.flashcards.length}</span><button disabled={currentCard === note.flashcards.length - 1} onClick={() => { setCurrentCard(c => c + 1); setIsFlipped(false); }} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 disabled:opacity-30 hover:bg-slate-700 transition-all shadow-xl"><ChevronLeft size={32} className="rotate-180" /></button></div>
                            </div>
                        ) : (<div className="text-center py-32 bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-2xl"><p className="text-slate-400 text-xl">No flashcards available.</p></div>)}
                    </motion.div>
                )}

                {activeTab === 'chat' && (
                    <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-700 h-[700px] flex flex-col overflow-hidden shadow-2xl">
                        <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex items-center gap-4"><div className="bg-primary/20 p-3 rounded-2xl"><MessageSquare size={24} className="text-primary" /></div><h3 className="text-xl font-bold">PDF Conversation Genie</h3></div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {chatMessages.map((msg, index) => (<div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-5 rounded-3xl text-lg ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg' : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-tl-none shadow-inner'}`}><p className="leading-relaxed">{msg.content}</p></div></div>))}
                            {chatLoading && (<div className="flex justify-start"><div className="bg-slate-900 border border-slate-700 p-5 rounded-3xl rounded-tl-none flex gap-3"><div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div><div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div><div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div></div></div>)}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleChat} className="p-6 bg-slate-900/50 border-t border-slate-700 flex gap-4"><input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask about the document..." className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-lg shadow-inner" /><button type="submit" disabled={chatLoading} className="bg-primary hover:bg-blue-700 p-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-primary/20"><Send size={28} /></button></form>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .backface-hidden { backface-visibility: hidden; }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
                .mermaid svg { max-width: 100% !important; height: auto !important; }
            `}</style>
        </div>
    );
};

export default NotesViewer;

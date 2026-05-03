import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesService } from '../services/api';
import { Upload, File, X, AlertCircle, Loader2 } from 'lucide-react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, generating, error
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

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
        if (!file) return;

        setStatus('uploading');
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('pdf', file);

            // 1. Upload and Extract Text
            const uploadRes = await notesService.uploadPDF(formData);
            const { extractedText, fileName } = uploadRes.data;

            setStatus('generating');
            
            // 2. Generate Notes with AI
            const notesRes = await notesService.generateNotes({ extractedText, fileName });
            
            navigate(`/notes/${notesRes.data._id}`);
        } catch (err) {
            setStatus('error');
            setError(err.response?.data?.message || 'Something went wrong during processing.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">Generate Smart Notes</h2>
            <p className="text-slate-400 mb-12">Upload a PDF and let our AI summarize it for you.</p>

            <div className="bg-slate-800 p-12 rounded-3xl border-2 border-dashed border-slate-700 hover:border-primary transition relative">
                {!file ? (
                    <>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                <Upload className="text-primary" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Click or drag to upload PDF</h3>
                            <p className="text-slate-500">Maximum file size 10MB</p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                            <File className="text-secondary" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{file.name}</h3>
                        <p className="text-slate-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        
                        {status === 'idle' && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFile(null)}
                                    className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
                                >
                                    <X size={20} />
                                    Remove
                                </button>
                                <button
                                    onClick={handleUpload}
                                    className="bg-primary hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-primary/20"
                                >
                                    Generate Notes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {(status === 'uploading' || status === 'generating') && (
                <div className="mt-12 bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
                    <h3 className="text-xl font-bold mb-2">
                        {status === 'uploading' ? 'Extracting text from PDF...' : 'AI is generating your notes...'}
                    </h3>
                    <p className="text-slate-400">This may take a few seconds depending on the document length.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="mt-8 bg-red-500/10 border border-red-500/50 text-red-500 p-6 rounded-2xl flex flex-col items-center gap-3">
                    <AlertCircle size={32} />
                    <h4 className="font-bold">Processing Failed</h4>
                    <p>{error}</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-4 text-sm font-bold underline"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;

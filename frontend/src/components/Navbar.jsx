import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wand2, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                <Wand2 size={32} className="text-secondary" />
                <span>NoteGenie AI</span>
            </Link>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
                        <Link to="/upload" className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">Upload PDF</Link>
                        <button onClick={handleLogout} className="flex items-center gap-1 text-slate-400 hover:text-white transition">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-primary transition">Login</Link>
                        <Link to="/register" className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

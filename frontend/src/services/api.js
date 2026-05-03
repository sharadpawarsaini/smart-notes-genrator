import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password }),
    getMe: () => api.get('/auth/me'),
};

export const notesService = {
    uploadPDF: (formData) => api.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    generateNotes: (data) => api.post('/notes/generate-notes', data),
    chatWithNote: (noteId, message) => api.post('/notes/chat', { noteId, message }),
    gradeQuiz: (noteId, answers) => api.post('/notes/grade-quiz', { noteId, answers }),
    getNotes: () => api.get('/notes'),
    getNoteById: (id) => api.get(`/notes/${id}`),
    deleteNote: (id) => api.delete(`/notes/${id}`),
    createOrder: () => api.post('/payments/create-order'),
    verifyPayment: (data) => api.post('/payments/verify', data),
};

export default api;

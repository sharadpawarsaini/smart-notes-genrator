require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

if (process.env.GROQ_API_KEY) {
    const key = process.env.GROQ_API_KEY.trim();
    console.log(`[Genie] ACTIVE KEY VERIFICATION: ${key.substring(0, 7)}...${key.substring(key.length - 4)}`);
    console.log(`[Genie] Key Length: ${key.length} characters`);
} else {
    console.warn('[Genie] WARNING: No GROQ_API_KEY found in .env!');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const { auth } = require('./middleware/auth');
const paymentController = require('./controllers/paymentController');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.post('/api/payments/create-order', auth, paymentController.createOrder);
app.post('/api/payments/verify', auth, paymentController.verifyPayment);

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

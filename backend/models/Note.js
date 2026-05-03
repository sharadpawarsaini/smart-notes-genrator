const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFileName: { type: String, required: true },
    extractedText: { type: String },
    summary: {
        short: String,
        detailed: String
    },
    keyPoints: [String],
    importantQuestions: [String],
    keyConcepts: [String],
    flashcards: [{
        question: String,
        answer: String
    }],
    mindMapCode: String,
    glossary: [{
        term: String,
        definition: String
    }],
    practicalApplications: [String],
    criticalThinking: [String],
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);

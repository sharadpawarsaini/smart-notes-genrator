const Note = require('../models/Note');
const User = require('../models/User');
const pdf = require('pdf-parse');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: (process.env.GROQ_API_KEY || '').trim()
});

if (!process.env.GROQ_API_KEY) {
    console.error('CRITICAL: GROQ_API_KEY is missing from .env file!');
}

exports.uploadPDF = async (req, res) => {
    try {
        console.log('Upload Request Received');
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        console.log('File Name:', req.file.originalname);
        const dataBuffer = req.file.buffer;
        
        // Final Fix: Use the PDFParse Class correctly
        let extractedText = '';
        try {
            // Some environments use the constructor directly, some use it via property
            const ParserClass = pdf.PDFParse || pdf;
            const parser = new ParserClass({ data: dataBuffer });
            const result = await parser.getText();
            extractedText = result.text;
        } catch (parseErr) {
            console.error('PDF Conversion Error:', parseErr);
            throw parseErr;
        }
        
        console.log('Text Extracted Successfully');
        res.json({ extractedText, fileName: req.file.originalname });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: `PDF Parsing Failed: ${err.message}` });
    }
};

exports.generateNotes = async (req, res) => {
    try {
        const { extractedText, fileName } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        
        const now = new Date();
        if (now - user.lastNoteReset > 30 * 24 * 60 * 60 * 1000) {
            user.notesCount = 0;
            user.lastNoteReset = now;
        }

        if (!user.isSubscribed && user.notesCount >= 20) {
            return res.status(403).json({ 
                message: 'Monthly limit reached', 
                limitReached: true,
                currentCount: user.notesCount,
                maxCount: 20
            });
        }

        const prompt = `
        Analyze the following text extracted from a PDF named "${fileName}".
        Provide:
        1. A short summary (2-3 sentences).
        2. A detailed summary.
        3. Key bullet points.
        4. 5 important questions from the text.
        5. Key concepts mentioned.
        6. 5 high-quality flashcards (question and answer pairs).
        7. A professional Mermaid.js FLOWCHART (graph TD). 
           IMPORTANT: Always wrap node labels in double quotes, e.g., A["Label with (Special) Characters"].
           Use simple IDs like A, B, C.
        8. A Glossary of Terms (at least 5 terms and definitions).
        9. 3 Practical Applications of this knowledge.
        10. 3 Critical Thinking prompts for deep study.

        Format the response as a VALID JSON object with the following structure:
        {
            "summary": { "short": "...", "detailed": "..." },
            "keyPoints": ["...", "..."],
            "importantQuestions": ["...", "..."],
            "keyConcepts": ["...", "..."],
            "flashcards": [{"question": "...", "answer": "..."}],
            "mindMapCode": "graph TD\\n...",
            "glossary": [{"term": "...", "definition": "..."}],
            "practicalApplications": ["...", "..."],
            "criticalThinking": ["...", "..."]
        }

        Text:
        ${extractedText.substring(0, 15000)}
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const aiResponseContent = completion.choices[0].message.content;
        console.log('AI Response Content Length:', aiResponseContent.length);
        
        const aiResponse = JSON.parse(aiResponseContent);

        const newNote = new Note({
            userId,
            originalFileName: fileName,
            extractedText,
            ...aiResponse,
            tags: [fileName.split('.').pop()] 
        });

        await newNote.save();
        user.notesCount += 1;
        await user.save();
        res.json(newNote);
    } catch (err) {
        console.error('--- GENERATION ERROR ---');
        console.error('Error Message:', err.message);
        res.status(500).json({ message: `Note Generation Failed: ${err.message}` });
    }
};

exports.chatWithNote = async (req, res) => {
    try {
        const { noteId, message } = req.body;
        const note = await Note.findOne({ _id: noteId, userId: req.user.id });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const prompt = `
        You are NoteGenie AI assistant. Answer questions based strictly on the text provided:
        ---
        ${note.extractedText.substring(0, 10000)}
        ---
        User Question: ${message}
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }]
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error('Chat Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.gradeQuiz = async (req, res) => {
    try {
        const { noteId, answers } = req.body;
        const note = await Note.findOne({ _id: noteId, userId: req.user.id });
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const prompt = `
        Grade the following quiz answers based on this text:
        ---
        ${note.extractedText.substring(0, 10000)}
        ---
        User's Quiz Answers:
        ${JSON.stringify(answers)}

        Format as JSON:
        {
            "scores": [{"questionIndex": 0, "score": 85, "feedback": "..."}, ...],
            "averageScore": 85,
            "overallFeedback": "..."
        }
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        res.json(JSON.parse(completion.choices[0].message.content));
    } catch (err) {
        console.error('Grading Error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const note = await Note.findOneAndDelete({ 
            _id: new mongoose.Types.ObjectId(req.params.id), 
            userId: new mongoose.Types.ObjectId(req.user.id) 
        });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

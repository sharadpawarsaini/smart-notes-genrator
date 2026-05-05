const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPDF, processOCR, generateNotes, getNotes, getNoteById, chatWithNote, deleteNote, gradeQuiz, summarizeYouTube } = require('../controllers/notesController');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', (req, res, next) => {
    console.log('Notes Route: /upload hit');
    next();
}, auth, upload.single('pdf'), uploadPDF);

router.post('/ocr', auth, upload.single('image'), processOCR);
router.post('/generate-notes', auth, generateNotes);
router.post('/youtube', auth, summarizeYouTube);
router.post('/chat', auth, chatWithNote);
router.post('/grade-quiz', auth, gradeQuiz);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNoteById);
router.delete('/:id', auth, deleteNote);

module.exports = router;

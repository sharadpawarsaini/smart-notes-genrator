const pdf = require('pdf-parse');
const fs = require('fs');

// Create a dummy buffer that looks like a PDF header
const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');

pdf(dummyPdf).then(data => {
    console.log('PDF Parse Success:', data.text);
}).catch(err => {
    console.error('PDF Parse Failed:', err);
});

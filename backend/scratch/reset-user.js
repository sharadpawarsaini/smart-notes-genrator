const mongoose = require('mongoose');
async function reset() {
    await mongoose.connect('mongodb://localhost:27017/smart-notes');
    await mongoose.connection.db.collection('users').updateOne(
        { email: 'sharadpawarsaini@gmail.com' },
        { $set: { notesCount: 0 } }
    );
    console.log('User notes count reset to 0');
    process.exit();
}
reset();

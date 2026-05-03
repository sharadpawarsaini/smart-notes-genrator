const bcrypt = require('bcryptjs');

async function test() {
    try {
        const hash = await bcrypt.hash('password123', 10);
        console.log('Hash success:', hash);
        const match = await bcrypt.compare('password123', hash);
        console.log('Match success:', match);
    } catch (err) {
        console.error('Bcrypt failed:', err);
    }
}

test();

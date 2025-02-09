const AsteriskManager = require('asterisk-manager');
require('dotenv').config();

// Initialize AMI connection
const ami = new AsteriskManager(5038, 'localhost', 'admin', 'password', true);
ami.keepConnected();

ami.on('connect', () => {
    console.log('✅ Asterisk AMI Connected Successfully!');
});

ami.on('error', (err) => {
    console.error('❌ AMI Connection Error:', err);
});

module.exports = ami;  // ✅ Ensure AMI is exported correctly

const db = require('../config/db');

const callModel = {
    logCall: (phone, totp, status) => {
        const query = 'INSERT INTO call_logs (phone, totp, status, timestamp) VALUES (?, ?, ?, NOW())';
        db.query(query, [phone, totp, status], (err, result) => {
            if (err) {
                console.error('❌ Failed to log call:', err);
            } else {
                console.log('✅ Call Logged Successfully:', result);
            }
        });
    }
};

module.exports = callModel;

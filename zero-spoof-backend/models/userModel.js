const db = require('../config/db');

const userModel = {
    createUser: (username, phone, secret, callback) => {
        const query = 'INSERT INTO users (username, phone, secret) VALUES (?, ?, ?)';
        db.query(query, [username, phone, secret], (err, result) => {
            if (err) {
                console.error('❌ Database Insert Error:', err);
                return callback(err, null);
            }
            console.log('✅ User Created Successfully:', result);
            callback(null, result);
        });
    },

    getUserByPhone: (phone, callback) => {
        const query = 'SELECT * FROM users WHERE phone = ?';
        db.query(query, [phone], (err, results) => {
            if (err) {
                console.error('❌ Database Query Error:', err);
                return callback(err, null);
            }
            console.log('🔍 Database Query Result:', results);
            callback(null, results);
        });
    }
};

module.exports = userModel;
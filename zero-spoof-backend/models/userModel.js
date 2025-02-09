const db = require('../config/db');

const userModel = {
    createUser: (username, phone, secret, callback) => {
        const query = 'INSERT INTO users (username, phone, secret) VALUES (?, ?, ?)';
        db.query(query, [username, phone, secret], callback);
    },

    getUserByPhone: (phone, callback) => {
        const query = 'SELECT * FROM users WHERE phone = ?';
        db.query(query, [phone], callback);
    }
};

module.exports = userModel;

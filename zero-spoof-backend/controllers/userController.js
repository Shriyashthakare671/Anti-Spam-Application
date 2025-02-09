const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { createUser, getUserByPhone } = require('../models/userModel');

exports.registerUser = (req, res) => {
    const { username, phone } = req.body;
    const secret = speakeasy.generateSecret();

    createUser(username, phone, secret.base32, (err, result) => {
        if (err) return res.status(500).send(err);

        QRCode.toDataURL(secret.otpauth_url, (err, qr) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'User registered', qrCode: qr, secret: secret.base32 });
        });
    });
};

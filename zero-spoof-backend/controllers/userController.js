const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { createUser, getUserByPhone } = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
        console.log('📥 Received Request:', req.body);

        const { username, phone } = req.body;
        
        if (!username || !phone) {
            console.error('❌ Missing Fields:', { username, phone });
            return res.status(400).json({ error: 'Username and Phone are required' });
        }

        // ✅ Generate TOTP Secret
        const secret = speakeasy.generateSecret({ name: `SpamBlocker:${username.trim()}` });
        console.log('🔹 Generated Secret:', secret);

        // ✅ Check if User Exists
        getUserByPhone(phone, async (err, existingUser) => {
            if (err) {
                console.error('❌ Database Query Error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (existingUser.length > 0) {
                console.log('❌ User already exists:', existingUser);
                return res.status(400).json({ error: 'User already exists' });
            }

            // ✅ Insert user into database
            createUser(username.trim(), phone, secret.base32, async (err, result) => {
                if (err) {
                    console.error('❌ Database Insert Error:', err);
                    return res.status(500).json({ error: 'Database insertion failed' });
                }

                console.log('✅ User Created Successfully:', result);

                // ✅ Generate Initial TOTP Token
                const totpToken = speakeasy.totp({
                    secret: secret.base32,
                    encoding: 'base32'
                });

                console.log('🔹 Generated TOTP Token:', totpToken);

                // ✅ Generate QR Code for 2FA
                QRCode.toDataURL(secret.otpauth_url, (err, qrCode) => {
                    if (err) {
                        console.error('❌ QR Code Generation Error:', err);
                        return res.status(500).json({ error: 'QR Code generation failed' });
                    }

                    console.log('✅ User Registered Successfully!');
                    res.json({
                        message: 'User registered successfully',
                        qrCode,
                        secret: secret.base32,
                        totpToken
                    });
                });
            });
        });
    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// 🔹 LOGIN USER API
exports.loginUser = async (req, res) => {
    try {
        console.log('📥 Login Request:', req.body);

        const { phone, totp } = req.body;
        if (!phone) {
            console.error('❌ Missing Phone Number');
            return res.status(400).json({ error: 'Phone Number is required' });
        }

        // ✅ Fetch User by Phone
        getUserByPhone(phone, (err, user) => {
            if (err) {
                console.error('❌ Database Query Error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (user.length === 0) {
                console.log('❌ User Not Found');
                return res.status(400).json({ error: 'User not found' });
            }

            const userSecret = user[0].secret; // ✅ Get stored TOTP secret

            // ✅ If TOTP token is missing, ask user to generate a new one
            if (!totp) {
                return res.json({
                    message: 'TOTP Token required. Click "Get Code" to generate a new token.',
                    requiresTotp: true
                });
            }

            // ✅ Verify TOTP Token
            const isValid = speakeasy.totp.verify({
                secret: userSecret,
                encoding: 'base32',
                token: totp,
                window: 2, // ✅ Allows slight time drift
            });

            if (isValid) {
                console.log('✅ Login Successful for:', phone);
                return res.json({ message: 'Login successful', verified: true });
            } else {
                console.log('❌ Invalid or Expired TOTP Token');
                return res.status(400).json({
                    error: 'Invalid or Expired TOTP Token. Click "Get Code" to generate a new one.'
                });
            }
        });
    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.checkUserExists = (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number required' });
    }


    getUserByPhone(phone, (err, user) => {
        if (err) {
            console.error('❌ Database Query Error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (user.length > 0) {
            console.log('✅ User Found:', phone);
            return res.json({ exists: true });
        } else {
            console.log('❌ No account found with this phone number:', phone);
            return res.status(404).json({ error: 'No account found with this phone number' });
        }
    });
};



exports.generateTOTP = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    getUserByPhone(phone, (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (user.length === 0) return res.status(400).json({ error: 'User not found' });

        const secret = user[0].secret;
        const totpToken = speakeasy.totp({ secret, encoding: 'base32' });

        res.json({ totpToken });
    });
};



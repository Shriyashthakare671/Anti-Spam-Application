const express = require('express');
const { registerUser, loginUser, generateTOTP, checkUserExists } = require('../controllers/userController'); // ✅ Import login function
const router = express.Router();

// ✅ Middleware for Async Error Handling
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ Validate User Input (Basic Validation)
const validateUserInput = (req, res, next) => {
    const { phone } = req.body;

    // ✅ Indian mobile number pattern (Starts with +91 or 10-digit number starting from 6-9)
    const indianPhoneRegex = /^(?:\+91)?[789]\d{9}$/;
    if (!phone || !indianPhoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid Indian phone number format. Use +91XXXXXXXXXX' });
    }
    next();
};


// ✅ Register User Route
router.post('/register', validateUserInput, catchAsync(registerUser));

// ✅ Check If User Exists
router.post('/check', checkUserExists);

// ✅ Generate New TOTP for Existing Users
router.post('/generate-totp', generateTOTP);

// ✅ Login User Route
router.post('/login', validateUserInput, catchAsync(loginUser));

module.exports = router;

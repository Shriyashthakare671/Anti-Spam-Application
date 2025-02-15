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
    
    if (!phone || !/^\d{10}$/.test(phone)) {  // Ensures phone is a 10-digit number
        return res.status(400).json({ error: 'Invalid phone number format' });
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

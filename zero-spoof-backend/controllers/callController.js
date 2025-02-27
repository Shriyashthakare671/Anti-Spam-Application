const ami = require('../config/asterisk');
const speakeasy = require('speakeasy');
const { getUserByPhone } = require('../models/userModel');
const callModel = require('../models/callModel'); // ✅ Import call model


exports.getAllCalls = async (req, res) => {
    try {
        const calls = await callModel.getAllCalls();
        res.json(calls);
    } catch (error) {
        console.error('❌ Error fetching call logs:', error);
        res.status(500).json({ error: 'Failed to fetch call logs' });
    }
};

// ✅ Check Spoofing Status
exports.checkSpoofing = async (req, res) => {
    try {
        let { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        phone = phone.replace(/\D/g, ''); // Normalize phone number
        const status = await callModel.checkSpoofing(phone);
        res.json({ phone, status });
    } catch (error) {
        console.error('❌ Error in checkSpoofing:', error);
        res.status(500).json({ error: 'Database error' });
    }
};


// ✅ Log Call Details
exports.logCall = async (req, res) => {
    try {
        let { phone, totp = '000000', status } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        // 📌 Auto-detect Spam Calls (Black List)
        if (phone.startsWith('140') || !/^[789]\d{9}$/.test(phone)) {
            status = 'black';
            console.log(`🚨 Auto-detected Spam Caller: ${phone} (Blacklisted)`);
        }
        await callModel.logCall(phone, totp, status);
        res.json({ message: 'Call logged successfully', phone, status });
    } catch (error) {
        console.error('❌ Error in logCall:', error);
        res.status(500).json({ error: 'Failed to log call' });
    }
};
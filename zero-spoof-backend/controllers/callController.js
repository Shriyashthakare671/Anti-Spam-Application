const ami = require('../config/asterisk');
const speakeasy = require('speakeasy');
const axios = request('axios');
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


exports.placeCallWithDTMF = async (phone, totpToken) => {
    const url = `http://<server>:5000/ConvoqueAPI/placeACall.jsp?src=server&dst=${phone}&type=SIP&callerID=SpamBlocker&ringDuration=60&refID=signupTOTP`;

    try {
        const response = await axios.get(url);
        console.log(`✅ Call Placed: ${response.data}`);

        // ✅ Send DTMF tones with the TOTP token
        await axios.get(`http://<server>:5000/ConvoqueAPI/sendDTMF.jsp?phone=${phone}&dtmf=${totpToken}`);

        console.log(`✅ DTMF TOTP Transmitted: ${totpToken}`);
    } catch (error) {
        console.error('❌ Failed to place call or send DTMF:', error);
    }
};


// ✅ Place A Call
exports.placeACall = async (req, res) => {
    const { src, dst, type = 'SIP', callerID, ringDuration = 60, refID } = req.body;

    if (!src || !dst) {
        return res.status(400).json({ error: 'Source and Destination are required.' });
    }

    const url = `http://<server>:5000/ConvoqueAPI/placeACall.jsp?src=${src}&dst=${dst}&type=${type}&callerID=${callerID}&ringDuration=${ringDuration}&refID=${refID}`;

    try {
        const response = await axios.get(url);
        console.log(`✅ Call Placed: ${response.data}`);
        res.json({ message: 'Call placed successfully', data: response.data });
    } catch (error) {
        console.error('❌ Failed to place call:', error);
        res.status(500).json({ error: 'Failed to place call' });
    }
};

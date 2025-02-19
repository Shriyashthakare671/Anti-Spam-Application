const ami = require('../config/asterisk'); // ✅ Ensure correct path
const speakeasy = require('speakeasy');
const { getUserByPhone } = require('../models/userModel');
const { logCall } = require('../models/callModel'); // ✅ New function to log calls
const cors = require('cors');

exports.initiateCall = (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^[789]\d{9}$/.test(phone)) {  
        return res.status(400).json({ error: 'Invalid Indian phone number format' });
    }

    getUserByPhone(phone, (err, result) => {
        if (err || result.length === 0) {
            console.error('❌ User Not Found:', err);
            return res.status(400).json({ error: 'User not found' });
        }

        const token = speakeasy.totp({
            secret: result[0].secret,
            encoding: 'base32'
        });

        console.log(`✅ Generated TOTP: ${token} for Phone: ${phone}`);

        if (!ami || typeof ami.action !== 'function') {
            console.error('❌ AMI is not initialized properly.');
            return res.status(500).json({ error: 'Asterisk Manager Interface (AMI) not available' });
        }

        const sipProvider = 'sip.provider'; // ✅ Ensure this matches Asterisk SIP trunk name
        
        const originateCall = (attempt = 1) => {
            if (attempt > 3) {
                console.error('❌ Maximum retry attempts reached.');
                return res.status(500).json({ error: 'Call failed after multiple attempts' });
            }

            ami.action({
                Action: 'Originate',
                Channel: `SIP/${sipProvider}/${phone}`,
                Context: 'default',
                Exten: phone,
                Priority: 1,
                CallerID: 'ZeroSpoof',
                Application: 'Playback',
                Data: `dtmf/${token}`
            }, async (err, response) => {
                if (err) {
                    console.error(`❌ Call Attempt ${attempt} Failed:`, err);
                    return setTimeout(() => originateCall(attempt + 1), 5000); // Retry after 5 sec
                }

                console.log('✅ Call Initiated Successfully:', response);
                
                // ✅ Store call details in the database
                await logCall(phone, token, 'initiated');

                res.json({ message: 'Call initiated', TOTP: token });
            });
        };

        originateCall(); // ✅ Start call initiation process
    });
};

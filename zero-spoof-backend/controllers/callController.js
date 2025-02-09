const ami = require('../config/asterisk'); // ✅ Ensure correct path
const speakeasy = require('speakeasy');
const { getUserByPhone } = require('../models/userModel');

exports.initiateCall = (req, res) => {
    const { phone } = req.body;

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
        
        // Replace 'my_sip_provider' with the actual SIP provider name from `sip show peers`
        const sipProvider = 'my_sip_provider';  // ✅ Ensure this matches Asterisk SIP trunk name
        
        ami.action({
            Action: 'Originate',
            Channel: `SIP/${sipProvider}/${phone}`,  // ✅ Correct SIP channel
            Context: 'default',
            Exten: phone,
            Priority: 1,
            CallerID: 'ZeroSpoof',
            Application: 'Playback',
            Data: `dtmf/${token}`
        }, (err, response) => {
            if (err) {
                console.error('❌ AMI Call Error:', err);
                return res.status(500).json({ error: 'Call initiation failed', details: err });
            }
            console.log('✅ Call Initiated Successfully:', response);
            res.json({ message: 'Call initiated', TOTP: token });
        });
        
    });
};


// http://localhost:3000/api/calls/call
// http://localhost:3000/api/users/register 
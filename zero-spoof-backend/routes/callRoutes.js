const express = require('express');
const { initiateCall } = require('../controllers/callController');
const router = express.Router();

router.post('/call', initiateCall);

module.exports = router;

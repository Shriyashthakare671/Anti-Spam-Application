const express = require('express');
const { initiateCall } = require('../controllers/callController'); // ✅ Ensure correct path
const router = express.Router();

router.post('/initiate', initiateCall); // ✅ Correct API path

module.exports = router;

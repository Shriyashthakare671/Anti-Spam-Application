const express = require('express');
const callController = require('../controllers/callController');
const router = express.Router();

router.post('/check', callController.checkSpoofing);
router.post('/log', callController.logCall);
router.get('/logs', callController.getAllCalls);

module.exports = router;

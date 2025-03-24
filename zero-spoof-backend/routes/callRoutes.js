const express = require('express');
const callController = require('../controllers/callController');
const router = express.Router();

router.post('/check', callController.checkSpoofing);
router.post('/log', callController.logCall);
router.get('/logs', callController.getAllCalls);
router.post('/placeCall', callController.placeACall);

module.exports = router;

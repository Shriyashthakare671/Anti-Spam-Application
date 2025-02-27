const express = require('express');
const callController = require('../controllers/callController');
const router = express.Router();

router.post('/check', callController.checkSpoofing);
router.post('/log', callController.logCall);

module.exports = router;

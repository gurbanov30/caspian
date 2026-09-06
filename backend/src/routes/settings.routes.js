const express = require('express');
const { requireAuth } = require('../middleware/auth');
const content = require('../controllers/content.controller');

const router = express.Router();
router.get('/', requireAuth, content.listSettings);
module.exports = router;

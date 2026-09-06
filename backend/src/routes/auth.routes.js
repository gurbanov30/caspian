const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/auth.controller');
const { requireAuth, requireCsrf } = require('../middleware/auth');

const router = express.Router();
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post('/login', loginLimit, controller.login);
router.get('/me', controller.me);
router.post('/logout', requireAuth, requireCsrf, controller.logout);
router.post('/change-password', requireAuth, requireCsrf, controller.changePassword);

module.exports = router;

const express = require('express');
const controller = require('../controllers/inquiries.controller');
const { requireAuth, requireCsrf } = require('../middleware/auth');

const router = express.Router();
router.post('/', controller.create);
router.get('/', requireAuth, controller.list);
router.get('/stats', requireAuth, controller.stats);
router.patch('/:id', requireAuth, requireCsrf, controller.update);
router.delete('/:id', requireAuth, requireCsrf, controller.remove);

module.exports = router;

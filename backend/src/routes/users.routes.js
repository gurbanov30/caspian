const express = require('express');
const controller = require('../controllers/users.controller');
const { requireAuth, requireCsrf, requireSuperAdmin } = require('../middleware/auth');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.use(requireAuth, requireSuperAdmin);
router.get('/', asyncHandler(controller.list));
router.post('/', requireCsrf, asyncHandler(controller.create));
router.patch('/:id', requireCsrf, asyncHandler(controller.update));
router.post('/:id/reset-password', requireCsrf, asyncHandler(controller.resetPassword));
router.delete('/:id', requireCsrf, asyncHandler(controller.remove));

module.exports = router;

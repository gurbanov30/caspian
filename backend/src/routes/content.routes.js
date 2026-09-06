const express = require('express');
const controller = require('../controllers/content.controller');
const { requireAuth, requireCsrf } = require('../middleware/auth');

const router = express.Router();
router.get('/public', controller.publicContent);
router.get('/settings', requireAuth, controller.listSettings);
router.get('/settings/:key', requireAuth, controller.getSetting);
router.put('/settings/:key', requireAuth, requireCsrf, controller.saveSetting);
router.get('/items', requireAuth, controller.list);
router.get('/items/:id', requireAuth, controller.get);
router.post('/items', requireAuth, requireCsrf, controller.create);
router.put('/items/:id', requireAuth, requireCsrf, controller.update);
router.delete('/items/:id', requireAuth, requireCsrf, controller.remove);

module.exports = router;

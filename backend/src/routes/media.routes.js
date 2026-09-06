const express = require('express');
const controller = require('../controllers/media.controller');
const upload = require('../middleware/upload');
const { requireAuth, requireCsrf } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, requireCsrf, upload.single('file'), controller.upload);
router.put('/:id', requireAuth, requireCsrf, upload.single('file'), controller.replace);
router.delete('/:id', requireAuth, requireCsrf, controller.remove);

module.exports = router;

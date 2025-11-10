const express = require('express');
const router = express.Router();
const { getRoles } = require('../controllers/roleController');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', authorizeRole(['manager', 'user']), getRoles);

module.exports = router;


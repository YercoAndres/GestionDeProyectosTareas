const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get(
  '/overview',
  authorizeRole(['manager']),
  analyticsController.getOverviewMetrics
);

router.get(
  '/projects/:projectId',
  authorizeRole(['manager', 'user']),
  analyticsController.getProjectAnalytics
);

module.exports = router;


const express = require('express');
const router = express.Router();
const timeEntryController = require('../controllers/timeEntryController');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.post(
  '/',
  authorizeRole(['manager', 'user']),
  timeEntryController.createTimeEntry
);

router.get(
  '/project/:projectId',
  authorizeRole(['manager', 'user']),
  timeEntryController.getTimeEntriesByProject
);

router.get(
  '/project/:projectId/summary',
  authorizeRole(['manager', 'user']),
  timeEntryController.getTimeSummaryByProject
);

router.get(
  '/task/:taskId',
  authorizeRole(['manager', 'user']),
  timeEntryController.getTimeEntriesByTask
);

module.exports = router;


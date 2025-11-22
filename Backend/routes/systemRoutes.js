const express = require('express');
const { getSystemStats } = require('../utils/systemStats');

const router = express.Router();

router.get('/stats', (req, res) => {
  res.json(getSystemStats());
});

module.exports = router;

const express = require('express');
const router = express.Router();
const shardBalancer = require('../config/shardBalancer');

router.get('/projects/summary', async (_req, res) => {
  try {
    if (!shardBalancer.hasShards) {
      return res
        .status(500)
        .json({ message: 'No hay shards configurados en el servidor' });
    }
    const data = await shardBalancer.getProjectsSummary();
    res.json(data);
  } catch (err) {
    console.error('Error en /projects/summary:', err);
    res.status(500).json({ error: 'Error obteniendo resumen de proyectos' });
  }
});

router.get('/projects/search', async (req, res) => {
  try {
    if (!shardBalancer.hasShards) {
      return res
        .status(500)
        .json({ message: 'No hay shards configurados en el servidor' });
    }
    const name = req.query.name || '';
    const projects = await shardBalancer.searchProjectsByName(name);
    res.json(projects);
  } catch (err) {
    console.error('Error en /projects/search:', err);
    res.status(500).json({ error: 'Error buscando proyectos en shards' });
  }
});

module.exports = router;

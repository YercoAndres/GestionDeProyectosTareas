// Inserta proyectos de forma distribuida en los shards usando shardBalancer.
// Configura DB_SHARD_DATABASES en .env y ajusta BULK_PROJECT_COUNT si quieres otro volumen.

require('dotenv').config();
const shardBalancer = require('./config/shardBalancer');

const TOTAL = parseInt(process.env.BULK_PROJECT_COUNT || '500000', 10);
const BATCH_SIZE = parseInt(process.env.BULK_PROJECT_BATCH || '10000', 10);
const STATUS_LOG_INTERVAL = parseInt(process.env.BULK_STATUS_INTERVAL || '60000', 10); // ms

const STATUS = ['En progreso', 'En pausa', 'Completado'];

if (!shardBalancer.hasShards) {
  console.error('No hay shards configurados (DB_SHARD_DATABASES vacío).');
  process.exit(1);
}

const buildRow = (i) => {
  const start = new Date(2024, 0, 1);
  start.setDate(start.getDate() + (i % 365));
  const end = new Date(start);
  end.setDate(end.getDate() + 30);
  return {
    name: `Proyecto masivo ${i}`,
    description: '',
    startDate: start,
    endDate: end,
    status: STATUS[i % STATUS.length],
    hashKey: i, // para distribuir estable por hash
  };
};

const insertBatch = async (rows) => {
  for (const row of rows) {
    await shardBalancer.queryAny(
      `
        INSERT INTO projects (name, description, start_date, end_date, status)
        VALUES (@name, @description, @startDate, @endDate, @status)
      `,
      {
        name: row.name,
        description: row.description,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
      },
      row.hashKey
    );
  }
};

const run = async () => {
  console.log(
    `Insertando ${TOTAL.toLocaleString()} proyectos en lotes de ${BATCH_SIZE} usando shards: ${process.env.DB_SHARD_DATABASES}`
  );

  let inserted = 0;
  const startTime = Date.now();
  let lastStatus = Date.now();
  const startMem = process.memoryUsage().rss;

  while (inserted < TOTAL) {
    const toTake = Math.min(BATCH_SIZE, TOTAL - inserted);
    const batch = [];
    for (let j = 0; j < toTake; j += 1) {
      const idx = inserted + j + 1;
      batch.push(buildRow(idx));
    }
    await insertBatch(batch);
    inserted += toTake;

    const now = Date.now();
    if (now - lastStatus >= STATUS_LOG_INTERVAL || inserted === TOTAL) {
      const elapsed = ((now - startTime) / 1000).toFixed(1);
      const mem = process.memoryUsage();
      const rssMb = (mem.rss / 1024 / 1024).toFixed(1);
      const heapMb = (mem.heapUsed / 1024 / 1024).toFixed(1);
      console.log(
        `Progreso: ${inserted.toLocaleString()} / ${TOTAL.toLocaleString()} | tiempo: ${elapsed}s | rss: ${rssMb} MB | heap: ${heapMb} MB`
      );
      lastStatus = now;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Completado: ${inserted.toLocaleString()} registros en ${elapsed}s`);
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error en carga masiva:', err);
    process.exit(1);
  });

const cluster = require('cluster');
const os = require('os');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const userRoutes = require('./routes/userRoutes');
const systemRoutes = require('./routes/systemRoutes');

dotenv.config();

const ENABLE_CLUSTER = process.env.ENABLE_CLUSTER === 'true';
const CPU_COUNT = os.cpus().length;
const CLUSTER_WORKERS = Math.min(
  Math.max(parseInt(process.env.CLUSTER_WORKERS || CPU_COUNT, 10) || CPU_COUNT, 1),
  CPU_COUNT
);

const RATE_WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS || '60000', 10);
const RATE_MAX = parseInt(process.env.RATE_MAX || '100', 10);
const SLOWDOWN_WINDOW_MS = parseInt(
  process.env.SLOWDOWN_WINDOW_MS || String(RATE_WINDOW_MS),
  10
);
const SLOWDOWN_DELAY_AFTER = parseInt(
  process.env.SLOWDOWN_DELAY_AFTER || String(Math.max(50, Math.floor(RATE_MAX / 2))),
  10
);
const SLOWDOWN_DELAY_MS = parseInt(process.env.SLOWDOWN_DELAY_MS || '200', 10);
const SLOWDOWN_MAX_DELAY_MS = parseInt(
  process.env.SLOWDOWN_MAX_DELAY_MS || '2000',
  10
);
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '1mb';
const TRUST_PROXY =
  process.env.TRUST_PROXY !== undefined
    ? parseInt(process.env.TRUST_PROXY, 10)
    : 1;

const limiter = rateLimit({
  windowMs: RATE_WINDOW_MS,
  max: RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      'Demasiadas solicitudes desde esta IP, intenta nuevamente mas tarde.',
  },
});

const speedLimiter = slowDown({
  windowMs: SLOWDOWN_WINDOW_MS,
  delayAfter: SLOWDOWN_DELAY_AFTER,
  delayMs: () => SLOWDOWN_DELAY_MS,
  maxDelayMs: SLOWDOWN_MAX_DELAY_MS,
});

const createApp = () => {
  const app = express();
  if (!Number.isNaN(TRUST_PROXY)) {
    app.set('trust proxy', TRUST_PROXY);
  }

  app.use(helmet());
  app.use(cors());
  app.use(speedLimiter);
  app.use(limiter);
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/system', systemRoutes);
  app.use(errorHandler);

  return app;
};

const startServer = () => {
  const app = createApp();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(
      `Worker ${process.pid} listening on port ${PORT} (cluster: ${ENABLE_CLUSTER})`
    );
  });
};

if (ENABLE_CLUSTER && cluster.isPrimary) {
  console.log(
    `Primary ${process.pid} inicializando ${CLUSTER_WORKERS} worker(s) para manejar la carga.`
  );
  for (let i = 0; i < CLUSTER_WORKERS; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.warn(`Worker ${worker.process.pid} finalizo. Creando uno nuevo.`);
    cluster.fork();
  });
} else {
  startServer();
}

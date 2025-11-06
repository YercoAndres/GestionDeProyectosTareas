const os = require('os');
const { monitorEventLoopDelay } = require('perf_hooks');

const SAMPLE_INTERVAL = parseInt(process.env.STATS_SAMPLE_MS || '1000', 10);
const CPU_COUNT = os.cpus().length || 1;

let histogram;
try {
  histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();
} catch (error) {
  histogram = null;
}

let lastCpuUsage = process.cpuUsage();
let lastHrTime = process.hrtime.bigint();
let lastCpuPercent = 0;

const sampleCpu = () => {
  const currentUsage = process.cpuUsage();
  const currentHr = process.hrtime.bigint();

  const userDiff = currentUsage.user - lastCpuUsage.user;
  const systemDiff = currentUsage.system - lastCpuUsage.system;
  const totalDiffMicros = userDiff + systemDiff;

  const elapsedMicros = Number(currentHr - lastHrTime) / 1000;
  if (elapsedMicros > 0) {
    const cpuPercent =
      (totalDiffMicros / elapsedMicros) * (100 / CPU_COUNT);
    lastCpuPercent = Math.max(0, cpuPercent);
  }

  lastCpuUsage = currentUsage;
  lastHrTime = currentHr;
};

setInterval(sampleCpu, SAMPLE_INTERVAL).unref();
sampleCpu();

const toMs = (value) => Number((value / 1e6).toFixed(2));

const getEventLoopStats = () => {
  if (!histogram) {
    return null;
  }
  return {
    min: toMs(histogram.min),
    max: toMs(histogram.max),
    mean: toMs(histogram.mean),
    stddev: toMs(histogram.stddev),
    percentiles: {
      p50: toMs(histogram.percentile(50)),
      p75: toMs(histogram.percentile(75)),
      p90: toMs(histogram.percentile(90)),
      p99: toMs(histogram.percentile(99)),
    },
  };
};

const getSystemStats = () => {
  const memoryUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent =
    totalMem > 0 ? ((totalMem - freeMem) / totalMem) * 100 : 0;

  return {
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    pid: process.pid,
    nodeVersion: process.version,
    cpu: {
      cores: CPU_COUNT,
      loadAverage: os.loadavg(),
      processPercent: Number(lastCpuPercent.toFixed(2)),
    },
    memory: {
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      arrayBuffers: memoryUsage.arrayBuffers,
      systemTotal: totalMem,
      systemFree: freeMem,
      systemUsedPercent: Number(usedMemPercent.toFixed(2)),
    },
    eventLoop: getEventLoopStats(),
    activeHandles: process._getActiveHandles
      ? process._getActiveHandles().length
      : undefined,
    activeRequests: process._getActiveRequests
      ? process._getActiveRequests().length
      : undefined,
    cluster: {
      enabled: process.env.ENABLE_CLUSTER === 'true',
      workerId: process.env.NODE_UNIQUE_ID || null,
    },
  };
};

module.exports = { getSystemStats };

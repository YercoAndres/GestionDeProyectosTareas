import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

const BASE = 'http://localhost:5000';
const TOKEN = ''; // reemplaza por tu token de manager

const codes = new Counter('status_codes');

export default function () {
  const res1 = http.get(`${BASE}/api/analytics/overview`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const res2 = http.get(`${BASE}/api/projects`);

  codes.add(res1.status);
  codes.add(res2.status);

  check(res1, { 'overview 200': (r) => r.status === 200 });
  check(res2, { 'projects 200': (r) => r.status === 200 });

  sleep(1);
}

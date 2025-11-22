# Proteccion ante picos de trafico

El backend ahora incluye varias defensas para mitigar ataques de denegacion de servicio (DoS) y uso abusivo.

## 1. Limitador de velocidad (rate limit)
- Middleware: `express-rate-limit`.
- Configuracion: controla cuantas solicitudes por ventana acepta cada IP.
- Variables:
  - `RATE_WINDOW_MS`: duracion de la ventana en milisegundos (por defecto 60000).
  - `RATE_MAX`: maximo de solicitudes permitidas por ventana (por defecto 100).
- Respuesta de exceso: HTTP 429 con mensaje generico.

## 2. Frenado progresivo
- Middleware: `express-slow-down`.
- Introduce retrasos crecientes cuando una IP mantiene un ritmo alto sin llegar al limite.
- Variables:
  - `SLOWDOWN_WINDOW_MS`: ventana de observacion (por defecto igual a `RATE_WINDOW_MS`).
  - `SLOWDOWN_DELAY_AFTER`: solicitudes permitidas antes de empezar a demorar.
  - `SLOWDOWN_DELAY_MS`: retraso base que se suma tras superar el umbral.
  - `SLOWDOWN_MAX_DELAY_MS`: tiempo maximo de retraso.

## 3. Limite de tamano de cuerpo
- `JSON_BODY_LIMIT` define el tamano maximo para `json` y formularios (por defecto `1mb`).
- Protege de cargas excesivas que saturen la memoria o el parser.

## 4. Proxy de confianza
- `TRUST_PROXY` controla si Express debe confiar en cabeceras como `X-Forwarded-For`. Ajustalo a `0` si no usas proxy inverso, o al numero de saltos necesarios en produccion.

## 5. Multiproceso opcional
- Activado mediante `ENABLE_CLUSTER=true`.
- Lanzara `CLUSTER_WORKERS` procesos (por defecto la cantidad de nucleos disponibles).
- Si un worker cae, el master crea uno nuevo automaticamente.

## 6. Monitoreo en linea
- Endpoint GET `/api/system/stats` devuelve un resumen del uso de CPU, memoria, handles activos y estado del event loop del proceso.
- Ajusta `STATS_SAMPLE_MS` para definir cada cuánto se recalcula el porcentaje de CPU del proceso.

## 7. Pasos de despliegue
1. Ajusta los valores del `.env` segun la capacidad de tu entorno.
2. Reinicia el backend para aplicar los cambios.
3. Monitorea logs: veras cuando una IP es frenada o cuando se recicla un worker.
4. En pruebas de carga, aumenta gradualmente `RATE_MAX` y `SLOWDOWN_DELAY_AFTER` hasta encontrar el equilibrio deseado entre resiliencia y experiencia de usuario legitimo.

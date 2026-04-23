# 🏸 BaBadminton - Monitoring & Alerting Setup

> **Version:** 2.0.0  
> **Health Endpoints:** `/health`, `/ready`, `/live`, `/metrics`

---

## 📊 Health Check Endpoints

ระบบมี 4 health endpoints พร้อมใช้งาน:

| Endpoint | Purpose | Status Code | Alert Threshold |
|----------|---------|-------------|-----------------|
| `GET /health` | Overall health + DB + memory | 200/503 | 2 failures |
| `GET /ready` | Readiness probe (DB + initialized) | 200/503 | Immediately |
| `GET /live` | Liveness probe (simple ping) | 200 always | After 3 failures |
| `GET /metrics` | Prometheus-format metrics | 200 | N/A |

### Example Responses

**GET /health** (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2026-04-22T07:30:00.000Z",
  "uptime": 86400.5,
  "checks": {
    "database": { "status": "ok", "responseTime": 5 },
    "memory": { "status": "ok", "used": 125, "total": 256, "external": 2 },
    "environment": { "NODE_ENV": "development", "PORT": 3000 }
  }
}
```

**GET /ready** (200 OK)
```json
{
  "status": "ready",
  "timestamp": "2026-04-22T07:30:00.000Z",
  "checks": {
    "database": "ok",
    "initialized": "ok"
  }
}
```

**GET /live** (200 OK)
```json
{
  "status": "alive",
  "timestamp": "2026-04-22T07:30:00.000Z",
  "pid": 12345
}
```

**GET /metrics** (Prometheus text format)
```
# HELP node_app_uptime_seconds Application uptime in seconds
# TYPE node_app_uptime_seconds counter
node_app_uptime_seconds 86400.50

# HELP node_app_memory_used_bytes Heap memory used
# TYPE node_app_memory_used_bytes gauge
node_app_memory_used_bytes 131072000
...
```

---

## 🔔 Monitoring Tools Setup

### Option 1: UptimeRobot (Free Tier — แนะนำ)

1. สมัคร https://uptimerobot.com/ (free: 50 monitors)
2. เพิ่ม monitor ใหม่:
   - **Type:** HTTP(s)
   - **URL:** `https://yourdomain.com/health`
   - **Interval:** 5 นาที
   - **Status codes:** 200, 201, 202, 203, 204

**Alert Channels:** Email, Slack, Telegram

---

### Option 2: Prometheus + Grafana (Self-Hosted)

**docker-compose.monitoring.yml:**
```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
```

**prometheus.yml:**
```yaml
scrape_configs:
  - job_name: 'babadminton'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

---

## 📈 Metrics ที่ควรติดตาม

### Application Metrics

| Metric | Warning | Critical | Source |
|--------|---------|----------|--------|
| Response Time P95 | >400ms | >800ms | `/metrics` |
| Error Rate | >0.5% | >2% | `/metrics` |
| Memory Usage | >400MB | >500MB | `/health` |
| Uptime | <99.9% | <99% | External |
| DB Response Time | >100ms | >500ms | `/health` |

### Business Metrics

| Metric | Warning | Critical |
|--------|---------|----------|
| Failed Logins/min | >10 | >50 |
| Booking Failures/hr | >5 | >20 |
| Concurrent Users | >500 | >1000 |

---

## 🚨 Alert Configuration (Slack Example)

```javascript
// scripts/send-alert.js
const axios = require('axios');

async function sendSlackAlert(message, severity = 'warning') {
  const colors = {
    info:    '#36a64f',
    warning: '#ffcc00',
    critical: '#ff0000'
  };

  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    attachments: [{
      color: colors[severity],
      title: `🏸 BaBadminton Alert — ${severity.toUpperCase()}`,
      text: message,
      ts: Math.floor(Date.now() / 1000)
    }]
  });
}

module.exports = { sendSlackAlert };
```

---

## 📝 Logging Best Practices

```javascript
// ใช้ winston สำหรับ structured logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Log Levels

| Level | ใช้เมื่อ |
|-------|----------|
| `error` | System failures, exceptions |
| `warn` | Recoverable issues |
| `info` | Login, booking, important events |
| `debug` | Debugging info |

---

## 📊 Phase 4 Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Health Endpoints | ✅ Done | `/health`, `/ready`, `/live`, `/metrics` |
| Prometheus Metrics | ✅ Done | Custom node metrics |
| Uptime Monitoring | ⚠️ Plan | External tool needed |
| Error Tracking (Sentry) | ⚠️ Plan | `npm install @sentry/node` |
| Structured Logging | ⚠️ Plan | ใช้ winston |
| Grafana Dashboard | ⚠️ Plan | Self-hosted |

---

## 🔧 Health Check Implementation

ดูโค้ดจริงได้ที่: `controller/healthController.js`

```javascript
// Key endpoints
app.get('/health',  healthController.getHealth);   // Full health + DB check
app.get('/metrics', healthController.getMetrics);  // Prometheus format
app.get('/ready',   healthController.getReadiness); // DB + initialized check
app.get('/live',    healthController.getLiveness);  // Simple ping
```

---

## 🆘 Incident Response

| Severity | Response Time | Example |
|----------|---------------|---------|
| SEV1 (Critical) | Immediate | DB down, 500 errors |
| SEV2 (High) | < 1 hour | Booking failures |
| SEV3 (Medium) | < 4 hours | Slow response |
| SEV4 (Low) | < 24 hours | UI glitch |

---

## 📚 Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [UptimeRobot API](https://uptimerobot.com/api/)
- [Express Health Check Pattern](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated:** 22 เมษายน 2026  
**Version:** 2.0.0

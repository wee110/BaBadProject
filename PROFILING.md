# Profiling Guide for BaBadProject

## 🔍 Profiling Tools Setup

โปรเจคนี้เพิ่ม profiling tools แล้วสำหรับวิเคราะห์ performance

### Installation

```bash
npm install
```

### Available Profiling Scripts

#### 1. CPU Profiling (Built-in Node.js)
```bash
npm run profile:cpu
```
- Generate V8 CPU profile
- ไฟล์ output: `isolate-*.log` ใน root directory
- วิเคราะห์ด้วย: `node --prof-process isolate-*.log > profile.txt`

#### 2. Flame Graph (0x)
```bash
npm run profile:flame
```
- สร้าง flame graph แบบ interactive
- Output: `./profiling/flame/`
- เปิดผลใน browser: `open profiling/flame/index.html`

**Usage:**
```bash
# Profile specific duration
npm run profile:flame

# แล้วกด Ctrl+C เมื่อได้ข้อมูลที่ต้องการ
```

#### 3. Clinic.js Doctor
```bash
npm run profile:clinic
```
- วิเคราะห์ performance bottlenecks อัตโนมัติ
- สร้าง HTTP load ด้วย autocannon
- แนะนำปัญหาที่เจอ (memory leak, event loop lag, etc.)

---

## 📊 Manual Profiling Methods

### Heap Snapshot (Memory Leak Detection)

```javascript
// ใน app.js หรือไฟล์ที่ต้องการ debug
const v8 = require('v8');

function takeHeapSnapshot() {
  const snapshot = v8.getHeapSnapshot();
  const filename = `heap-${Date.now()}.heapsnapshot`;
  const stream = require('fs').createWriteStream(filename);
  snapshot.pipe(stream);
  console.log(`Heap snapshot saved to ${filename}`);
}

// เรียกใช้เมื่อต้องการเช็ค memory
setInterval(takeHeapSnapshot, 60000); // ทุก 1 นาที
```

### Event Loop Lag Monitoring

```javascript
function checkEventLoopLag() {
  const start = Date.now();
  setImmediate(() => {
    const lag = Date.now() - start;
    if (lag > 100) {
      console.warn(`⚠️ Event loop lag detected: ${lag}ms`);
    }
  });
}

setInterval(checkEventLoopLag, 5000);
```

---

## 🎯 What to Profile

### Common Performance Issues in Express Apps

1. **Database Queries**
   - Slow queries ใน MySQL
   - Connection pool exhaustion
   - N+1 query problems

2. **Memory Leaks**
   - Global variables
   - Closures ที่ไม่จำเป็น
   - Event listeners ที่ไม่ถูก remove

3. **Event Loop Blocking**
   - Synchronous operations
   - Large JSON parsing
   - Heavy computations

4. **HTTP Performance**
   - Slow endpoints
   - Large response sizes
   - Missing caching

---

## 📈 Interpreting Results

### Flame Graph
- **Wide bars** = functions ที่ใช้เวลานาน
- **Stack depth** = call hierarchy
- มองหา functions ที่กว้างแต่ไม่ควรใช้เวลานาน

### Clinic.js Doctor
- **CPU Usage** > 80% = อาจมี bottleneck
- **Memory** ที่เพิ่มขึ้นเรื่อยๆ = memory leak
- **Event Loop Delay** > 100ms = blocking operations
- **HTTP Latency** สูง = slow endpoints

### Heap Snapshot
- เปรียบเทียบ snapshots หลายๆ อัน
- มองหา objects ที่เพิ่มขึ้นไม่ถูก garbage collected
- ใช้ Chrome DevTools เปิดไฟล์ `.heapsnapshot`

---

## 🛠️ Quick Performance Checklist

- [ ] รัน `npm run profile:clinic` 1 รอบ
- [ ] เช็ค slow endpoints ด้วย autocannon
- [ ] วิเคราะห์ database queries (enable slow query log)
- [ ] ตรวจสอบ memory usage ภายใต้ load
- [ ] ตั้งค่า monitoring สำหรับ production

---

## 📚 Resources

- [0x Profiler](https://github.com/davidmarkclements/0x)
- [Clinic.js](https://clinicjs.org/)
- [Node.js Performance Checklist](https://github.com/thedaviddias/Node-Performance)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

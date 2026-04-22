// ============================================
// 🏸 BaBadminton — MySQL Database Connection
// ============================================

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'babadminton',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// ── Auto-initialize tables on first run ──
async function initDatabase() {
  try {
    const conn = await pool.getConnection();

    // Create tables if they don't exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) DEFAULT NULL,
        password_hash VARCHAR(255) DEFAULT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        email VARCHAR(255) DEFAULT NULL,
        avatar VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        court_type ENUM('single', 'double') DEFAULT 'double',
        surface ENUM('synthetic', 'wooden', 'cement') DEFAULT 'synthetic',
        price_per_hour INT DEFAULT 200,
        facilities TEXT DEFAULT NULL,
        description TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        court_id INT NOT NULL,
        booking_date DATE NOT NULL,
        start_time VARCHAR(5) NOT NULL,
        end_time VARCHAR(5) NOT NULL,
        user_id INT NOT NULL,
        status ENUM('pending', 'approved', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_court_date (court_id, booking_date),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Seed default data if tables are empty
    const [userRows] = await conn.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      await conn.query(`
        INSERT INTO users (id, username, password, password_hash, role, email) VALUES
          (1, 'admin', 'admin123', ?, 'admin', 'admin@babadminton.com'),
          (2, 'user1', '1234', ?, 'user', 'user1@babadminton.com'),
          (3, 'user2', '1234', ?, 'user', 'user2@babadminton.com')
      `, [
        bcrypt.hashSync('admin123', 10),
        bcrypt.hashSync('1234', 10),
        bcrypt.hashSync('1234', 10)
      ]);
      console.log('  ✅ Seeded default users (with Explicit IDs)');
    }

    // Force UTF-8 session
    await conn.query('SET NAMES utf8mb4');

    const [courtRows] = await pool.query('SELECT id, name FROM courts LIMIT 1');
    
    // Force re-seed if table is empty OR if data looks garbled OR if ID shifted from 1
    const needsReseed = courtRows.length === 0 || courtRows[0].name.includes('à') || courtRows[0].id !== 1;
    
    if (needsReseed) {
      console.log('  ⚠️  Database structure or encoding issue detected. Forcing re-seed...');
      await conn.query('DELETE FROM bookings'); // Clear bookings to avoid FK issues
      await conn.query('DELETE FROM courts');
      
      await conn.query(`
        INSERT INTO courts (id, name, court_type, surface, price_per_hour, facilities, description) VALUES
          (1, 'สนาม A', 'double', 'synthetic', 200, '💡 ไฟส่องสว่าง,❄️ แอร์,🅿️ ที่จอดรถ', 'สนามแบดมินตันคู่ พื้นสังเคราะห์คุณภาพสูง พร้อมระบบแอร์'),
          (2, 'สนาม B', 'double', 'wooden', 250, '💡 ไฟส่องสว่าง,❄️ แอร์,🚿 ห้องอาบน้ำ,🅿️ ที่จอดรถ', 'สนามพื้นไม้ระดับแข่งขัน เหมาะสำหรับนักกีฬาที่ต้องการคุณภาพสูงสุด'),
          (3, 'สนาม C', 'single', 'synthetic', 150, '💡 ไฟส่องสว่าง,🅿️ ที่จอดรถ', 'สนามเดี่ยวสำหรับฝึกซ้อม ราคาประหยัด'),
          (4, 'สนาม D', 'double', 'synthetic', 200, '💡 ไฟส่องสว่าง,❄️ แอร์,🚿 ห้องอาบน้ำ', 'สนามคู่มาตรฐาน พื้นสังเคราะห์กันลื่น'),
          (5, 'สนาม E (Premium)', 'double', 'wooden', 350, '💡 ไฟส่องสว่าง,❄️ แอร์,🚿 ห้องอาบน้ำ,🅿️ ที่จอดรถ,📺 จอ Scoreboard', 'สนาม Premium พื้นไม้เกรด A พร้อม Scoreboard ดิจิทัล'),
          (6, 'สนาม F', 'single', 'cement', 100, '💡 ไฟส่องสว่าง', 'สนามเดี่ยวกลางแจ้ง ราคาถูกสุด เหมาะสำหรับเล่นสบายๆ')
      `);
      console.log('  ✅ Seeded default courts (with Explicit IDs)');
    }

    conn.release();
    console.log('  ✅ Database initialized successfully');
    return true;
  } catch (err) {
    console.error('  ❌ Database initialization failed:', err.message);
    return false;
  }
}

module.exports = { pool, initDatabase };

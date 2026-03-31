// ============================================
// 🏸 BaBadminton — Data Model
// In-memory data store for courts & bookings
// ============================================

const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@babadminton.com', avatar: null }
];

let nextUserId = 2;

let courts = [
  {
    id: 1,
    name: 'สนาม A',
    courtType: 'double',
    surface: 'synthetic',
    pricePerHour: 200,
    facilities: ['💡 ไฟส่องสว่าง', '❄️ แอร์', '🅿️ ที่จอดรถ'],
    description: 'สนามแบดมินตันคู่ พื้นสังเคราะห์คุณภาพสูง พร้อมระบบแอร์'
  },
  {
    id: 2,
    name: 'สนาม B',
    courtType: 'double',
    surface: 'wooden',
    pricePerHour: 250,
    facilities: ['💡 ไฟส่องสว่าง', '❄️ แอร์', '🚿 ห้องอาบน้ำ', '🅿️ ที่จอดรถ'],
    description: 'สนามพื้นไม้ระดับแข่งขัน เหมาะสำหรับนักกีฬาที่ต้องการคุณภาพสูงสุด'
  },
  {
    id: 3,
    name: 'สนาม C',
    courtType: 'single',
    surface: 'synthetic',
    pricePerHour: 150,
    facilities: ['💡 ไฟส่องสว่าง', '🅿️ ที่จอดรถ'],
    description: 'สนามเดี่ยวสำหรับฝึกซ้อม ราคาประหยัด'
  },
  {
    id: 4,
    name: 'สนาม D',
    courtType: 'double',
    surface: 'synthetic',
    pricePerHour: 200,
    facilities: ['💡 ไฟส่องสว่าง', '❄️ แอร์', '🚿 ห้องอาบน้ำ'],
    description: 'สนามคู่มาตรฐาน พื้นสังเคราะห์กันลื่น'
  },
  {
    id: 5,
    name: 'สนาม E (Premium)',
    courtType: 'double',
    surface: 'wooden',
    pricePerHour: 350,
    facilities: ['💡 ไฟส่องสว่าง', '❄️ แอร์', '🚿 ห้องอาบน้ำ', '🅿️ ที่จอดรถ', '📺 จอ Scoreboard'],
    description: 'สนาม Premium พื้นไม้เกรด A พร้อม Scoreboard ดิจิทัล'
  },
  {
    id: 6,
    name: 'สนาม F',
    courtType: 'single',
    surface: 'cement',
    pricePerHour: 100,
    facilities: ['💡 ไฟส่องสว่าง'],
    description: 'สนามเดี่ยวกลางแจ้ง ราคาถูกสุด เหมาะสำหรับเล่นสบายๆ'
  }
];

let bookings = [];
let nextCourtId = 7;
let nextBookingId = 1;

module.exports = {
  // ── User Management ──
  findUser: (username, password) => {
    return users.find(u => u.username === username && u.password === password);
  },

  findOrCreateGoogleUser: (profile) => {
    let user = users.find(u => u.email === profile.emails[0].value && u.role !== 'admin');
    if (!user) {
      user = {
        id: nextUserId++,
        username: profile.displayName,
        password: null,
        role: 'user',
        email: profile.emails[0].value,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      };
      users.push(user);
    }
    return user;
  },

  findUserById: (id) => {
    return users.find(u => u.id === id);
  },

  getUsers: () => users,

  // ── Court Management ──
  getCourts: () => courts,

  getCourtById: (id) => {
    return courts.find(c => c.id === parseInt(id));
  },

  addCourt: (courtData) => {
    const court = {
      id: nextCourtId++,
      name: courtData.name,
      courtType: courtData.courtType || 'double',
      surface: courtData.surface || 'synthetic',
      pricePerHour: parseInt(courtData.pricePerHour) || 200,
      facilities: courtData.facilities || [],
      description: courtData.description || ''
    };
    courts.push(court);
    return court;
  },

  // ── Booking Management ──
  getBookings: () => bookings,

  getBookingById: (id) => {
    return bookings.find(b => b.id === parseInt(id));
  },

  getUserBookings: (userId) => {
    return bookings.filter(b => b.userId === userId);
  },

  addBooking: (courtId, date, startTime, endTime, userId) => {
    const booking = {
      id: nextBookingId++,
      courtId: parseInt(courtId),
      date,
      startTime,
      endTime,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.push(booking);
    return booking;
  },

  // ── Overbooking Prevention ──
  // Check if there is ANY booking (pending or approved) that conflicts
  hasConflictingBooking: (courtId, date, startTime, endTime, excludeBookingId) => {
    return bookings.some(b =>
      b.courtId === parseInt(courtId) &&
      b.date === date &&
      (b.status === 'approved' || b.status === 'pending') &&
      (excludeBookingId ? b.id !== parseInt(excludeBookingId) : true) &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );
  },

  // Legacy compatibility
  hasApprovedBooking: (courtId, date, startTime, endTime) => {
    return bookings.some(b =>
      b.courtId === parseInt(courtId) &&
      b.date === date &&
      (b.status === 'approved' || b.status === 'pending') &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );
  },

  isCourtAvailable: (courtId, date, startTime, endTime) => {
    return !bookings.some(b =>
      b.courtId === parseInt(courtId) &&
      b.date === date &&
      (b.status === 'approved' || b.status === 'pending') &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );
  },

  // ── Search with Filters ──
  searchAvailableCourts: (date, startTime, endTime, courtType, surface) => {
    let filteredCourts = courts;

    if (courtType && courtType !== 'all') {
      filteredCourts = filteredCourts.filter(c => c.courtType === courtType);
    }
    if (surface && surface !== 'all') {
      filteredCourts = filteredCourts.filter(c => c.surface === surface);
    }

    return filteredCourts.map(court => {
      const hasConflict = bookings.some(b =>
        b.courtId === court.id &&
        b.date === date &&
        (b.status === 'approved' || b.status === 'pending') &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      );

      const hasPendingOnly = !hasConflict ? false : bookings.some(b =>
        b.courtId === court.id &&
        b.date === date &&
        b.status === 'pending' &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      ) && !bookings.some(b =>
        b.courtId === court.id &&
        b.date === date &&
        b.status === 'approved' &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      );

      return {
        ...court,
        availability: hasConflict ? (hasPendingOnly ? 'pending' : 'unavailable') : 'available'
      };
    });
  },

  approveBooking: (bookingId) => {
    const booking = bookings.find(b => b.id === parseInt(bookingId));
    if (booking) booking.status = 'approved';
    return booking;
  },

  removeBooking: (bookingId) => {
    const index = bookings.findIndex(b => b.id === parseInt(bookingId));
    if (index > -1) return bookings.splice(index, 1)[0];
    return null;
  },

  // ── Helpers ──
  getRooms: () => courts,  // backward compat
};

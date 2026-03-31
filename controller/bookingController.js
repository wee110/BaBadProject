// ============================================
// 🏸 BaBadminton — Booking Controller
// Create, Approve, Remove bookings
// Overbooking prevention included
// ============================================

const data = require('../model/data');

const showBooking = (req, res) => {
  const courtId = req.params.roomId;
  const court = data.getCourtById(courtId);

  if (!court) {
    return res.redirect('/dashboard');
  }

  res.render('booking', {
    room: court,
    court,
    error: null,
    user: req.session.user
  });
};

const createBooking = (req, res) => {
  const courtId = req.params.roomId;
  const { date, startTime, endTime } = req.body;
  const court = data.getCourtById(courtId);

  if (!court) {
    return res.redirect('/dashboard');
  }

  // Validate: end time must be after start time
  if (startTime >= endTime) {
    return res.render('booking', {
      room: court,
      court,
      error: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น',
      user: req.session.user
    });
  }

  // Validate: operating hours (06:00 - 22:00)
  if (startTime < '06:00' || endTime > '22:00') {
    return res.render('booking', {
      room: court,
      court,
      error: 'สนามเปิดให้บริการเวลา 06:00 - 22:00 เท่านั้น',
      user: req.session.user
    });
  }

  // Validate: minimum 1 hour booking
  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
  if ((endMinutes - startMinutes) < 60) {
    return res.render('booking', {
      room: court,
      court,
      error: 'ต้องจองขั้นต่ำ 1 ชั่วโมง',
      user: req.session.user
    });
  }

  // ★ OVERBOOKING PREVENTION ★
  // Check ALL bookings (pending + approved) for time conflicts
  if (data.hasConflictingBooking(courtId, date, startTime, endTime)) {
    return res.render('booking', {
      room: court,
      court,
      error: '⚠️ สนามนี้ถูกจองในช่วงเวลานี้แล้ว กรุณาเลือกเวลาอื่น',
      user: req.session.user
    });
  }

  // Validate: date not in the past
  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.render('booking', {
      room: court,
      court,
      error: 'ไม่สามารถจองวันที่ผ่านมาแล้วได้',
      user: req.session.user
    });
  }

  data.addBooking(courtId, date, startTime, endTime, req.session.user.id);
  res.redirect('/dashboard');
};

const approveBooking = (req, res) => {
  const bookingId = req.params.id;
  data.approveBooking(bookingId);
  res.redirect('/dashboard');
};

const removeBooking = (req, res) => {
  const bookingId = req.params.id;
  const booking = data.getBookingById(bookingId);

  if (booking && (req.session.user.role === 'admin' || booking.userId === req.session.user.id)) {
    data.removeBooking(bookingId);
  }

  res.redirect('/dashboard');
};

module.exports = { showBooking, createBooking, approveBooking, removeBooking };

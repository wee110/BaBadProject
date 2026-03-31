const data = require('../model/data');

const showBooking = (req, res) => {
  const roomId = req.params.roomId;
  const room = data.getRooms().find(r => r.id === parseInt(roomId));
  res.render('booking', { room, error: null });
};

const createBooking = (req, res) => {
  const { roomId } = req.params;
  const { date, startTime, endTime } = req.body;
  
  if (startTime >= endTime) {
    const room = data.getRooms().find(r => r.id === parseInt(roomId));
    return res.render('booking', { 
      room, 
      error: 'End time must be after start time' 
    });
  }
  
  if (data.hasApprovedBooking(roomId, date, startTime, endTime)) {
    const room = data.getRooms().find(r => r.id === parseInt(roomId));
    return res.render('booking', { 
      room, 
      error: 'Room has approved booking at this time' 
    });
  }
  
  data.addBooking(roomId, date, startTime, endTime, req.session.user.id);
  res.redirect('/dashboard');
};

const approveBooking = (req, res) => {
  const bookingId = req.params.id;
  data.approveBooking(bookingId);
  res.redirect('/dashboard');
};

const removeBooking = (req, res) => {
  const bookingId = req.params.id;
  const booking = data.getBookings().find(b => b.id === parseInt(bookingId));
  
  if (req.session.user.role === 'admin' || booking.userId === req.session.user.id) {
    data.removeBooking(bookingId);
  }
  
  res.redirect('/dashboard');
};

module.exports = { showBooking, createBooking, approveBooking, removeBooking };

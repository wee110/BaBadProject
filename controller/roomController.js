const data = require('../model/data');

const showDashboard = (req, res) => {
  const rooms = data.getRooms();
  const bookings = data.getBookings();
  res.render('dashboard', { 
    user: req.session.user, 
    rooms, 
    bookings 
  });
};

const showAddRoom = (req, res) => {
  res.render('add-room');
};

const addRoom = (req, res) => {
  const { name, capacity } = req.body;
  data.addRoom(name, parseInt(capacity));
  res.redirect('/dashboard');
};

const showSearch = (req, res) => {
  res.render('search', { results: null, searchData: null });
};

const searchRooms = (req, res) => {
  const { date, startTime, endTime } = req.body;
  const results = data.searchAvailableRooms(date, startTime, endTime);
  res.render('search', { 
    results, 
    searchData: { date, startTime, endTime } 
  });
};

const showCalendar = (req, res) => {
  const bookings = data.getBookings();
  const rooms = data.getRooms();
  res.render('calendar', { bookings, rooms, user: req.session.user });
};

module.exports = { showDashboard, showAddRoom, addRoom, showSearch, searchRooms, showCalendar };

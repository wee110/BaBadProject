// ============================================
// 🏸 BaBadminton — Court Controller
// Dashboard, Search, Calendar, Add Court
// ============================================

const data = require('../model/data');

const showDashboard = (req, res) => {
  const courts = data.getCourts();
  const bookings = data.getBookings();
  const users = data.getUsers();
  res.render('dashboard', {
    user: req.session.user,
    courts,
    bookings,
    users
  });
};

const showAddCourt = (req, res) => {
  res.render('add-room', { user: req.session.user });
};

const addCourt = (req, res) => {
  const { name, courtType, surface, pricePerHour, description, facilities } = req.body;
  const facilityList = Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []);
  data.addCourt({
    name,
    courtType,
    surface,
    pricePerHour: parseInt(pricePerHour),
    description,
    facilities: facilityList
  });
  res.redirect('/dashboard');
};

const showSearch = (req, res) => {
  res.render('search', {
    results: null,
    searchData: null,
    user: req.session.user
  });
};

const searchRooms = (req, res) => {
  const { date, startTime, endTime, courtType, surface } = req.body;

  // Validate time range
  if (startTime >= endTime) {
    return res.render('search', {
      results: null,
      searchData: { date, startTime, endTime, courtType, surface },
      user: req.session.user,
      error: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น'
    });
  }

  const results = data.searchAvailableCourts(date, startTime, endTime, courtType, surface);
  res.render('search', {
    results,
    searchData: { date, startTime, endTime, courtType, surface },
    user: req.session.user
  });
};

const showCalendar = (req, res) => {
  const bookings = data.getBookings();
  const courts = data.getCourts();
  const users = data.getUsers();

  // Support month navigation
  const monthOffset = parseInt(req.query.month) || 0;

  res.render('calendar', {
    bookings,
    rooms: courts,
    courts,
    users,
    user: req.session.user,
    monthOffset
  });
};

module.exports = {
  showDashboard,
  showAddRoom: showAddCourt,
  addRoom: addCourt,
  showSearch,
  searchRooms,
  showCalendar,
  showAddCourt,
  addCourt
};

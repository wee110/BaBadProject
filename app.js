const express = require('express');
const session = require('express-session');
const path = require('path');
const authController = require('./controller/authController');
const roomController = require('./controller/roomController');
const bookingController = require('./controller/bookingController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'room-booking-secret',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

app.get('/dashboard', authController.requireAuth, roomController.showDashboard);
app.get('/rooms/add', authController.requireAuth, authController.requireAdmin, roomController.showAddRoom);
app.post('/rooms/add', authController.requireAuth, authController.requireAdmin, roomController.addRoom);

app.get('/search', authController.requireAuth, roomController.showSearch);
app.post('/search', authController.requireAuth, roomController.searchRooms);
app.get('/calendar', authController.requireAuth, roomController.showCalendar);

app.post('/bookings/:id/approve', authController.requireAuth, authController.requireAdmin, bookingController.approveBooking);
app.post('/bookings/:id/remove', authController.requireAuth, bookingController.removeBooking);

app.get('/book/:roomId', authController.requireAuth, bookingController.showBooking);
app.post('/book/:roomId', authController.requireAuth, bookingController.createBooking);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

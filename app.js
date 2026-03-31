// ============================================
// 🏸 BaBadminton — Main Application
// Express + Passport + Google OAuth
// ============================================

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const data = require('./model/data');

const authController = require('./controller/authController');
const roomController = require('./controller/roomController');
const bookingController = require('./controller/bookingController');

const app = express();
const PORT = process.env.PORT || 3000;

// ── View Engine ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// ── Middleware ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'babadminton-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// ── Passport Setup ──
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = data.findUserById(id);
  done(null, user);
});

// Google OAuth Strategy - only set up if credentials are configured
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleAuth = googleClientId && googleClientId !== 'placeholder' &&
                      googleClientSecret && googleClientSecret !== 'placeholder';

if (hasGoogleAuth) {
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const user = data.findOrCreateGoogleUser(profile);
    return done(null, user);
  }));
  console.log('✅ Google OAuth configured');
} else {
  console.log('⚠️  Google OAuth not configured - using admin login only');
  console.log('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable');
}

// Make googleAuth status available to views
app.use((req, res, next) => {
  res.locals.hasGoogleAuth = hasGoogleAuth;
  next();
});

// ── Routes ──

// Auth
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Google OAuth Routes
if (hasGoogleAuth) {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=Google login failed' }),
    authController.googleCallback
  );
}

// Dashboard
app.get('/dashboard', authController.requireAuth, roomController.showDashboard);

// Court Management (Admin only)
app.get('/rooms/add', authController.requireAuth, authController.requireAdmin, roomController.showAddCourt);
app.post('/rooms/add', authController.requireAuth, authController.requireAdmin, roomController.addCourt);

// Search
app.get('/search', authController.requireAuth, roomController.showSearch);
app.post('/search', authController.requireAuth, roomController.searchRooms);

// Calendar
app.get('/calendar', authController.requireAuth, roomController.showCalendar);

// Bookings
app.get('/book/:roomId', authController.requireAuth, bookingController.showBooking);
app.post('/book/:roomId', authController.requireAuth, bookingController.createBooking);
app.post('/bookings/:id/approve', authController.requireAuth, authController.requireAdmin, bookingController.approveBooking);
app.post('/bookings/:id/remove', authController.requireAuth, bookingController.removeBooking);

// ── Start Server ──
app.listen(PORT, () => {
  console.log('');
  console.log('🏸 ═══════════════════════════════════════');
  console.log('   BaBadminton Court Booking System');
  console.log(`   Running on http://localhost:${PORT}`);
  console.log('   Admin login: admin / admin123');
  console.log('🏸 ═══════════════════════════════════════');
  console.log('');
});

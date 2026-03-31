const data = require('../model/data');

const showLogin = (req, res) => {
  res.render('login', { error: null });
};

const login = (req, res) => {
  const { username, password } = req.body;
  const user = data.findUser(username, password);
  
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

module.exports = { showLogin, login, logout, requireAuth, requireAdmin };

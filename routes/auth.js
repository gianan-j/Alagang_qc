const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { fullname, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error hashing password');

    const sql = 'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)';
    db.query(sql, [fullname, email, hash], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Email already exists or DB error');
      }
      // ✅ Redirect to login page after successful registration
      res.redirect('/login');
    });
  });
});


// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send('Invalid email');
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        res.send(`Welcome, ${user.fullname}`);
      } else {
        res.status(401).send('Invalid password');
      }
    });
  });
});

module.exports = router;

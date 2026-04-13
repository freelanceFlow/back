const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

router.get('/me', authMiddleware, (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

module.exports = router;

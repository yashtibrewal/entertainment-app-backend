require('dotenv').config();
const jwt = require('jsonwebtoken');

const userRouter = require('express').Router();
const passport = require('passport');
const { User } = require('../models/User');
const MESSAGES = require('../utils/constants');
const bcrypt = require('bcrypt');

// Register route
userRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: MESSAGES.USER.ERROR.ALREADY_EXISTS });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Return success response
    res.status(201).json({ message: MESSAGES.USER.SUCCESS.REGISTERED });
  } catch (err) {
    res.status(500).json({ message: MESSAGES.SERVER.ERROR });
  }
});

// Login route (JWT Authentication)
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: MESSAGES.USER.ERROR.INVALID_CREDS });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: MESSAGES.USER.ERROR.INVALID_CREDS });
    }

    // Create JWT token
    const payload = { id: user._id, name: user.name, role: user.role };
    // Expiration set to 1 year for better UX.
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1y' });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.mode === 'PRODUCTION',
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: 'strict'
    })
    
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: MESSAGES.SERVER.ERROR });
  }
});

userRouter.patch('/logout', async (req, res) => {
  res.statusCode(200);
})

// Protected route example
userRouter.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Profile accessed', user: req.user });
});

module.exports = { userRouter };
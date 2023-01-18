const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const homeController = require('../controllers/home.controller');
const authMiddleware = require('../middlewares/authMiddleware.controller');

// Home page
router.get('/', homeController.index);

// Users routes
router.use('/user', authMiddleware);//Auth middleware
router.use('/user', usersRouter);

// Auth routes
router.use('/auth', authRouter);

module.exports = router;

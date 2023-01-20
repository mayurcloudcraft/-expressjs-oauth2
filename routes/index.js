const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const oauth2Router = require('./oauth2');
const homeController = require('../controllers/home.controller');
const authMiddleware = require('../middlewares/authMiddleware.controller');

// Home page
router.get('/', homeController.index);

// Users routes
router.use('/user', authMiddleware);//Auth middleware
router.use('/user', usersRouter);

// Auth routes
router.use('/auth', authRouter);
router.use('/', oauth2Router);

module.exports = router;

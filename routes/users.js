var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
/* GET users listing. */
router.get('/profile', userController.profile);

module.exports = router;

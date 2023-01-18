const {sequelize} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = sequelize.models.User;
const jwtSecret = 'secret';

exports.login = async function (req, res, next) {
    if (!req.body.email) {
        res.json({'status': false, 'msg': 'Email is required'});
    }

    if (!req.body.password) {
        res.json({'status': false, 'msg': 'Password is required'});
    }

    const user = await User.findOne({
        where: {
            email: req.body.email,
        }
    });

    if (!user) {
        res.json({'status': false, 'msg': 'Invalid credentials'});
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.json({'status': false, 'msg': 'Invalid credentials'});
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    jwt.sign(jwtPayload, jwtSecret, {expiresIn: '1 hour'}, (err, token) => {
        if (err) {
            res.json({'status': false, 'msg': 'Something went wrong'});
        }
        res.json({'status': true, 'msg': 'Logged In Successfully', token});
    });
}

exports.register = function (req, res, next) {
    const user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).then(result => {
        res.json({'status': true, 'msg': 'Success', 'data': result});
    }).catch(error => {
        res.json({'status': false, 'msg': error.toString()});
    });
}

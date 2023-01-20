const {sequelize} = require('../models');
const jwt = require('jsonwebtoken');
var session = require('express-session')
const User = sequelize.models.User;
const jwtSecret = 'secret';

exports.login = async function (req, res, next) {
    if (!req.body.email) {
        res.json({'status': false, 'msg': 'Email is required'});
    }

    if (!req.body.password) {
        res.json({'status': false, 'msg': 'Password is required'});
    }

    const user = await User.getUserByEmailAndPassword(req.body.email, req.body.password);

    if (!user) {
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

exports.oauth2loginForm = async function (req, res, next) {
    res.render('oauth2/login', {
        redirect: req.query.redirect,
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri,
        error: req.query.error,
    });
}

exports.oauth2login = async function (req, res, next) {
    // Insert your own login mechanism

    if (!req.body.email) {
        res.redirect('/login?error=Email%20is%20required&client_id=' + req.body.client_id + '&redirect_uri=' + req.body.redirect_uri+ '&redirect=' + req.body.redirect);
    }

    if (!req.body.password) {
        res.redirect('/login?error=Password%20is%20required&client_id=' + req.body.client_id + '&redirect_uri=' + req.body.redirect_uri+ '&redirect=' + req.body.redirect);
    }

    const user = await User.getUserByEmailAndPassword(req.body.email, req.body.password);

    if (!user) {
        res.redirect('/login?error=Invalid%20credentials&client_id=' + req.body.client_id + '&redirect_uri=' + req.body.redirect_uri+ '&redirect=' + req.body.redirect);
    }

    req.session.regenerate(function (err) {
        if (err) next(err)

        req.session.user = user

        req.session.save(function (err) {
            if (err) return next(err)
            res.redirect((req.body.redirect || '/home') + '?client_id=' + req.body.client_id + '&redirect_uri=' + req.body.redirect_uri);
        })
    })
}

exports.oauth2authorizePage = async function (req, res, next) {

    if (!req.session.user) {
        // If they aren't logged in, send them to your own login implementation
        return res.redirect('/login?redirect=' + req.path + '&client_id=' +
            req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
    }

    res.render('oauth2/authorise', {
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri
    });
}

exports.oauth2authorizeCheck = async function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?client_id=' + req.query.client_id +
            '&redirect_uri=' + req.query.redirect_uri + '&redirect=oauth%2Fauthorise');
    }

    next();
}
exports.oauth2authorize = async function (req, next) {
    // The first param should to indicate an error
    // The second param should a bool to indicate if the user did authorise the app
    // The third param should for the user/uid (only used for passing to saveAuthCode)
    next(null, true, req.session.user);
}

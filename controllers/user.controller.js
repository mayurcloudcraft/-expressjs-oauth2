const {sequelize} = require('../models')

exports.index = async function (req, res, next) {
    const users = await sequelize.models.User.findAll();
    res.json(users);
}

exports.profile = function (req, res, next) {
    res.json({profile: req.user});
}

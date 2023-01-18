const jwt = require('jsonwebtoken');
const jwtSecret = 'secret';

module.exports = (req, res, next) => {
    const token = req.headers?.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token){
        res.json({'status': false, 'msg': 'Unauthenticated'});
    }

    jwt.verify(token, jwtSecret, function(err, decoded) {
        if (err){
            res.json({'status': false, 'msg': 'Unauthenticated'});
        }

        req.user = decoded;
        next();
    });
}

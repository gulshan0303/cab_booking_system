
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET 

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            throw new Error();
        }
        req.user = decoded;
        req.url = req.protocol + '://' + req.get('host');
        next()
    } catch (error) {
        res.status(403).send({ success: false, message: 'Unauthorized access!!' })
    }
}

const isAuthorize = (role) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user || user.role !== role) {
                return res.status(403).send({ success: false, message: 'Only Admin can use this resource' });
            }
            next();
        } catch (error) {
            res.status(500).send({ success: false, message: 'Internal Server Error' });
        }
    };
};

module.exports = {auth,isAuthorize}

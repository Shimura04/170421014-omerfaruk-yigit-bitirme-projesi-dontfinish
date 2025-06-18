const refreshTokenStore = require('../services/refreshToken')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const accessToken = req.cookies.dontfinish
    if (!accessToken) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
        req.userID = payload.userID
        req.username = payload.username
        next()
    } catch (err) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }
}

module.exports = auth
// Import bcrypt for hashing purposes
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Import the database object
const db = require('../db/db')
const { CreateBucket } = require('./minio')

const refreshTokenStore = require('../services/refreshToken')

const signup = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)

    db.tx(async t => {
        const id = await t.one(
            'INSERT INTO account(username, email, password) VALUES($1, $2, $3) RETURNING id',
            [req.body.username, req.body.email, hash]
        )

        try {
            await CreateBucket(req.body.username)
        } catch (error) {
            throw new Error('Bucket creation failed: ' + error.message);
        }

        return { id }
    })
    .then(data => {
        const accessToken = jwt.sign({ userID: data.id, username: req.body.username }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' })
        const refreshToken = jwt.sign({ userID: data.id, username: req.body.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

        refreshTokenStore.set(data.id, refreshToken)

        res.cookie('dontfinish', accessToken, { httpOnly: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true })

        return res.status(201).json({
            status: 'success',
            data: {
                userID: data.id,
                username: req.body.username
            }
        })
    })
    .catch(error => {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    });
}

// singin function lets users to sign in
const signin = async (req, res) => {
    db.tx(async t => {
        const { id, username, password } = await t.one(
            'SELECT id, username, password FROM account WHERE username = $1',
            [req.body.username]
        )

        return { id, username, password }
    })
    .then(async data => {
        const isValid = await bcrypt.compare(req.body.password, data.password)
        if (!isValid) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid username or password'
            })
        }

        const accessToken = jwt.sign({ userID: data.id, username: data.username }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' })
        const refreshToken = jwt.sign({ userID: data.id, username: data.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

        refreshTokenStore.set(data.id, refreshToken)

        res.cookie('dontfinish', accessToken, { httpOnly: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true })

        return res.status(200).json({
            status: 'success',
            data: {
                userID: data.id,
                username: data.username
            }
        })
    })
    .catch(() => {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid username'
        })
    })
}

const signout = (req, res) => {
    const accessToken = req.cookies.dontfinish
    const refreshToken = req.cookies.refreshToken

    if (accessToken) {
        try {
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
            refreshTokenStore.delete(payload.userID)
        } catch (_) {}
    }

    res.clearCookie('dontfinish')
    res.clearCookie('refreshToken')

    return res.status(200).json({
        status: 'success'
    })
}

const me = (req, res) => {
    const accessToken = req.cookies.dontfinish
    const refreshToken = req.cookies.refreshToken

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
        return res.status(200).json({ status: 'success', userID: payload.userID, username: payload.username })
    } catch (err) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
            try {
                const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

                const storedToken = refreshTokenStore.get(refreshPayload.userID)
                if (storedToken !== refreshToken) {
                    return res.status(403).json({ status: 'fail', message: 'Invalid refresh token' })
                }

                const newAccessToken = jwt.sign({ userID: refreshPayload.userID, username: refreshPayload.username }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' })

                res.cookie('dontfinish', newAccessToken, { httpOnly: true })

                return res.status(200).json({
                    status: 'success',
                    userID: refreshPayload.userID,
                    username: refreshPayload.username
                })
            } catch (refreshErr) {
                console.log(refreshErr)
                return res.status(401).json({ status: 'fail', message: 'Invalid or expired refresh token' })
            }
        }

        return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
    }
}


// Export the functions to use it in routes module.
module.exports = {
    me,
    signup,
    signin,
    signout
}
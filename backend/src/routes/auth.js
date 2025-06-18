// Importing the router from express
const { Router } = require('express')
const authController = require('../controllers/auth')

const router = Router()

// Using the functions defined in controllers module
router.get('/me', authController.me)
router.post('/signup', authController.signup)
router.post('/signin', authController.signin)
router.delete('/signout', authController.signout)

// Exporting the router to use it in app.js file
module.exports = router
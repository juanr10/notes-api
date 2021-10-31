const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

// Route for authenticate users (requests on api/auth)
/* Log in */
authRouter.post('/', authController.authenticateUser)

/* Get user authenticated */
authRouter.get('/',
  auth,
  authController.userAuthenticated
)

module.exports = authRouter

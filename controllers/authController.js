const User = require('../models/User')
const bcryptjs = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * @name:authenticateUser.
 * @description:creates a JWT when a user is authenticated.
 * @param:request & response.
 * @return:json object.
 */
exports.authenticateUser = async (req, res) => {
  const { username, password } = req.body

  try {
    // Check registered user
    const user = await User.findOne({ username })

    // Check password
    const passCheck = user === null ? false : await bcryptjs.compare(password, user.passwordHash)

    if (!(user && passCheck)) {
      return res.status(401).json({ msg: 'Invalid username or password' })
    }

    // Create & sign JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    }

    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600
    }, (error, token) => {
      if (error) throw error

      res.json({ token })
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error authenticating user')
  }
}

/**
 * @name:userAuthenticated.
 * @description:Get user authenticated (All data except the password).
 * @param:request & response.
 * @return:json object.
 */
exports.userAuthenticated = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error obtaining authenticated user')
  }
}

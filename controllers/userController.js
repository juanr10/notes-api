const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('../models/User')

exports.create = async (request, response) => {
  // Check errors from req
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }

  try {
    const { body } = request
    const { username, name, password } = body

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
}

const usersRouter = require('express').Router()
const usersController = require('../controllers/userController')
const { check } = require('express-validator')

usersRouter.get('/', usersController.getAll)

usersRouter.post('/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  usersController.create)

module.exports = usersRouter

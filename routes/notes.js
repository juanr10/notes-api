const notesRouter = require('express').Router()
const notesController = require('../controllers/noteController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

notesRouter.get('/', notesController.getAll)

notesRouter.get('/:id', notesController.find)

notesRouter.post('/',
  auth,
  [
    check('content', 'The content of the note is required').not().isEmpty()
  ],
  notesController.create
)

notesRouter.put('/:id', auth, notesController.update)

notesRouter.delete('/:id', auth, notesController.delete)

module.exports = notesRouter

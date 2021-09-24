const notesRouter = require('express').Router()
const notesController = require('../controllers/noteController')
const { check } = require('express-validator')

notesRouter.get('/', notesController.getAll)

notesRouter.get('/:id', notesController.find)

notesRouter.post('/',
  [
    check('content', 'The content of the note is required').not().isEmpty()
  ],
  notesController.create
)

notesRouter.put('/:id', notesController.update)

notesRouter.delete('/:id', notesController.delete)

module.exports = notesRouter

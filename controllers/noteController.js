const { validationResult } = require('express-validator')
const Note = require('../models/Note')
const User = require('../models/User')

exports.getAll = async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
}

exports.find = async (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    return note
      ? response.json(note)
      : response.status(404).end()
  }).catch(err => {
    next(err)
  })
}

exports.create = async (request, response, next) => {
  // Check errors from req
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }

  const { id } = request.user

  const { content, important = false } = request.body

  const user = await User.findById(id)

  const newNote = new Note({
    content,
    date: new Date().toISOString(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
}

exports.update = async (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const noteToUpdate = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, noteToUpdate, { new: true }).then(result => {
    response.json(result)
  }).catch(err => {
    next(err)
  })
}

exports.delete = async (request, response, next) => {
  const { id } = request.params

  try {
    await Note.findByIdAndRemove(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
}

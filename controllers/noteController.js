const { validationResult } = require('express-validator')
const Note = require('../models/Note')

exports.getAll = async (request, response) => {
  const notes = await Note.find({})
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

  const note = request.body

  if (!note.content) {
    return response.status(400).json({
      error: 'required "content" is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' || false
  })

  try {
    const savedNote = await newNote.save()
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

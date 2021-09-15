const User = require('../models/User')
const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Learning Node!',
    important: true,
    date: new Date()
  },
  {
    content: 'Learning JEST',
    important: true,
    date: new Date()
  }
]

const getNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response: response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = { initialNotes, api, getNotes, getUsers }

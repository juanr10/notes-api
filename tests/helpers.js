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

module.exports = { initialNotes, api, getNotes }

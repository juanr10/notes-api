
const Note = require('../models/Note')
const { server } = require('../index')
const { disconnectDB } = require('../config/db')
const { initialNotes, api, getNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // parallel
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET /api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const { response } = await getNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('there are notes about nodeJS', async () => {
    const { contents } = await getNotes()

    expect(contents).toContain('Learning Node!')
  })
})

describe('POST /api/notes', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'Soon async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test("a invalid note can't be added", async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const { response } = await getNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE /api/notes', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .send(noteToDelete)
      .expect(204)

    const { response: secondResponse, contents } = await getNotes()
    expect(secondResponse.body).toHaveLength(notes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note with malformed id can not be deleted', async () => {
    await api
      .delete('/api/notes/1234')
      .expect(400)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/613d37a7d6ceba5d48623bc0')
      .expect(204)

    const { response } = await getNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(async () => {
  await disconnectDB()
  server.close()
})

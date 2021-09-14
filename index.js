require('dotenv').config()
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
// DB connection
connectDB()
// Model
const Note = require('./models/Note')
// Middlewares
const usersRouter = require('./controllers/users')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

Sentry.init({
  dsn: 'https://9c1614fee010437f958d07c090889946@o980873.ingest.sentry.io/5935385',
  environment: process.env.ENVIRONMENT,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// Routes/Controllers
app.get('/', (request, response) => {
  response.send('<h1>Welcome to notes API!</h1>')
})

app.get('/api/notes/', async (request, response, next) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    return note
      ? response.json(note)
      : response.status(404).end()
  }).catch(err => {
    next(err)
  })
})

app.post('/api/notes', async (request, response, next) => {
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
})

app.put('/api/notes/:id', (request, response, next) => {
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
})

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Note.findByIdAndRemove(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Controllers
app.use('/api/users', usersRouter)

// Middlewares
// Unknow route
app.use(notFound)
// Sentry
app.use(Sentry.Handlers.errorHandler())
// Handle errors -> TODO
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }

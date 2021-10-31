require('dotenv').config()
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
// DB connection
connectDB()
// Middlewares
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

// Controllers
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/notes', require('./routes/notes'))

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

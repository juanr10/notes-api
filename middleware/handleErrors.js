const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({ error: 'id used is malformed' }),

  JsonWebTokenError: res => res.status(401).send({ error: 'token missing or invalid' }),

  TokenExpiredError: res => res.status(401).send({ error: 'token expired' }),

  defaultError: res => res.status(500).end()
}

module.exports = (error, request, res, next) => {
  console.error(error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(res, error)
}

const logger = require('./logger')

const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) req.token = authorization.substring(7)
  next()
}

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') { res.status(400).send({ error: 'malformatted id' }) }
  if (error.name === 'ValidationError') { res.status(400).send({ error: error.message }) }
  if (error.name === 'Unauthorized') { res.status(401).send({ error: error.message }) }
  if (error.name === 'JsonWebTokenError') { res.status(401).send({ error: 'invalid token' }) }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}

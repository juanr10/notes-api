const jwt = require('jsonwebtoken')

/**
 * @name:authentication middleware.
 * @description:check if a token exists and the validity of this one.
 * @param:request, response & next func.
 * @return:json object.
*/
module.exports = function (request, res, next) {
  // Reading token from header
  // const token = req.header('x-auth-token')

  let token

  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  // Check if there's a token

  if (!token) {
    return res.status(404).json({ msg: 'Permission denied, no registration token registered. Please log in' })
  }

  // Validate token
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = decodedToken.user
    next()
  } catch (error) {
    next(error)
  }
}

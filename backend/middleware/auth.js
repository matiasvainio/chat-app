const jwt = require('jsonwebtoken')

const verifytoken = (req, res, next) => {
  const auth = req.headers.authorization
  console.log(req.headers);
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }

  if (!req.token) {
    return res.status(403).json({ error: 'token required for authentication' })
  }

  try {
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY)
    req.user = decoded
  } catch (err) {
    console.log(err)
  }

  return next()
}

module.exports = verifytoken
const users = require('./index')

const handleExists = (req, res) => {
  res.json({ exists: users.nicknameExists(req.params.nickname) })
}

module.exports = ({ Router }) => {
  const router = Router()

  router.get('/:nickname/exists', handleExists)

  return router
}

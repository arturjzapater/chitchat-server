const token = require('../utils/token')
const users = require('./index')

const handleCreate = (req, res) => {
  if (users.nicknameExists(req.body.nickname)) {
    res.json({
      ok: false,
      reason: 'Nickname taken'
    })
    return
  }

  const { nickname, userId } = users.add(undefined, req.body.nickname)
  const response = {
    ok: true,
    token: token.encode({ nickname, userId })
  }

  res.json(response)
}

module.exports = ({ Router }) => {
  const router = Router()

  router.post('/', handleCreate)

  return router
}

const uuid = require('uuid')
const token = require('../utils/token')

let users = []

const list = () =>
  users.map(({ nickname, userId, isTyping, joined }) => ({
    nickname,
    userId,
    isTyping,
    joined
  }))

const nicknameExists = userNick =>
  users.some(({ nickname }) => nickname === userNick)

const add = (socketId, nickname) => {
  const user = {
    socketId,
    nickname,
    userId: uuid.v1(),
    isTyping: false,
    joined: undefined
  }
  users = users.concat(user)

  return user
}

const find = id => users.find(({ userId }) => userId === id)

const remove = socket => {
  users = users.filter(({ socketId }) => socketId !== socket)
}

const reset = () => {
  users = []
}

const update = (userId, updatedInfo) => {
  const user = find(userId)
  if (!user) return

  remove(user.socketId)
  users = users.concat(Object.assign(user, updatedInfo))
}

const validate = userToken => {
  try {
    const { nickname, userId } = token.decode(userToken)
    return users.some(x => x.nickname === nickname && x.userId === userId)
  } catch (e) {
    return false
  }
}

module.exports = {
  add,
  list,
  nicknameExists,
  remove,
  reset,
  update,
  validate
}

const uuid = require('uuid')

let users = []

const list = () => users

const nicknameExists = userNick =>
  users.some(({ nickname }) => nickname === userNick)

const add = nickname => {
  users = users.concat({
    id: uuid.v1(),
    nickname,
    isTyping: false,
    joined: Date.now()
  })
}

const remove = userId => {
  users = users.filter(({ id }) => id !== userId)
}

module.exports = {
  add,
  list,
  nicknameExists,
  remove
}

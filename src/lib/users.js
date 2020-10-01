let users = []

const list = () => [...users]

const nicknameExists = userNick =>
  users.some(({ nickname }) => nickname === userNick)

const add = (id, nickname) => {
  users = users.concat({
    id,
    nickname,
    isTyping: false,
    joined: Date.now()
  })

  return id
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

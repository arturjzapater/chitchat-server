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

const find = userId => users.find(x => x.id === userId)

const remove = userId => {
  users = users.filter(({ id }) => id !== userId)
}

const reset = () => {
  users = []
}

const update = (userId, updatedInfo) => {
  const user = find(userId)
  if (!user) return

  remove(userId)
  users = users.concat(Object.assign(user, updatedInfo))
}

module.exports = {
  add,
  list,
  nicknameExists,
  remove,
  reset,
  update
}

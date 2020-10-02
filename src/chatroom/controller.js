const users = require('../users')

const join = (io, socket) => name => {
  if (users.nicknameExists(name)) {
    socket.emit('nickname taken')
    return
  }

  users.add(socket.id, name)
  socket.nickname = name
  console.log(socket.id, socket.nickname)
  io.emit('update userlist', users.list())
  io.emit('new message', {
    user: socket.nickname,
    text: 'joined the conversation',
    timestamp: Date.now(),
    type: 'system'
  })
}

const newMessage = (io, socket) => message => {
  io.emit('new message', {
    user: socket.nickname,
    text: message,
    timestamp: Date.now(),
    type: 'user'
  })
}

const userTyping = (io, socket) => isTyping => {
  io.emit('user typing', { socket, isTyping })
}

const disconnect = (io, socket) => () => {
  console.log(`${socket.nickname} left (${socket.id})`)
  users.remove(socket.id)
  io.emit('update userlist', users.list())
  io.emit('user left', socket.id)
  io.emit('new message', {
    user: socket.nickname,
    text: 'left the conversation',
    timestamp: Date.now(),
    type: 'system'
  })
}

module.exports = (io, socket) => ({
  join: join(io, socket),
  newMessage: newMessage(io, socket),
  userTyping: userTyping(io, socket),
  disconnect: disconnect(io, socket)
})

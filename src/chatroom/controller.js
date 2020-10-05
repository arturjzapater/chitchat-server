const users = require('../users')
const { timeout } = require('../../config/socket')

const makeTimeout = socket => setTimeout(() => {
  socket.emit('inactive')
  socket.inactive = true
  socket.disconnect(true)
}, timeout)

const join = (io, socket) => name => {
  users.add(socket.id, name)
  socket.nickname = name
  socket.timeout = makeTimeout(socket)

  io.emit('update userlist', users.list())
  io.emit('new message', {
    user: socket.nickname,
    text: 'joined the conversation.',
    timestamp: Date.now(),
    type: 'system'
  })
}

const newMessage = (io, socket) => message => {
  clearTimeout(socket.timeout)
  socket.timeout = makeTimeout(socket)

  io.emit('new message', {
    user: socket.nickname,
    text: message,
    timestamp: Date.now(),
    type: 'user'
  })
}

const userTyping = (io, socket) => isTyping => {
  users.update(socket.id, { isTyping })
  io.emit('update userlist', users.list())
}

const disconnect = (io, socket) => () => {
  users.remove(socket.id)

  const text = socket.inactive
    ? 'was disconnected due to inactivity.'
    : 'left the conversation.'

  io.emit('update userlist', users.list())
  io.emit('new message', {
    user: socket.nickname,
    text,
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

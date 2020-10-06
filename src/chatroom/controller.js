const users = require('../users')
const { inactiveTimeout, typingTimeout } = require('../../config/socket')

const makeInactiveTimeout = socket => {
  if (socket.inactiveTimeout) clearTimeout(socket.inactiveTimeout)

  return setTimeout(() => {
    socket.emit('inactive')
    socket.inactive = true
    socket.disconnect(true)
  }, inactiveTimeout)
}

const makeTypingTimeout = (io, socket) => {
  if (socket.typingTimeout) clearTimeout(socket.typingTimeout)

  return setTimeout(() => {
    users.update(socket.id, { isTyping: false })
    io.emit('update userlist', users.list())
  }, typingTimeout)
}

const join = (io, socket) => name => {
  users.add(socket.id, name)
  socket.nickname = name
  socket.inactiveTimeout = makeInactiveTimeout(socket)

  io.emit('update userlist', users.list())
  io.emit('new message', {
    user: socket.nickname,
    text: 'joined the conversation.',
    timestamp: Date.now(),
    type: 'system'
  })
}

const newMessage = (io, socket) => message => {
  socket.inactiveTimeout = makeInactiveTimeout(socket)

  io.emit('new message', {
    user: socket.nickname,
    text: message,
    timestamp: Date.now(),
    type: 'user'
  })
}

const userTyping = (io, socket) => () => {
  socket.typingTimeout = makeTypingTimeout(io, socket)

  users.update(socket.id, { isTyping: true })
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

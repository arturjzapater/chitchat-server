const users = require('../users')
const token = require('../utils/token')
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
    users.update(socket.userId, { isTyping: false })
    io.emit('update userlist', users.list())
  }, typingTimeout)
}

const join = (io, socket) => {
  const { nickname, userId } = token.decode(socket.handshake.query.token)
  users.update(userId, {
    socketId: socket.id,
    joined: Date.now()
  })

  socket.inactiveTimeout = makeInactiveTimeout(socket)
  socket.nickname = nickname
  socket.userId = userId

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

  users.update(socket.userId, { isTyping: true })
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

module.exports = (io, socket) => {
  if (!users.validate(socket.handshake.query.token)) {
    socket.disconnect(true)
    return null
  }

  join(io, socket)

  return {
    newMessage: newMessage(io, socket),
    userTyping: userTyping(io, socket),
    disconnect: disconnect(io, socket)
  }
}

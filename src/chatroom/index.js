const makeController = require('./controller')

module.exports = io => socket => {
  const controller = makeController(io, socket)
  console.log('New connection', socket.id)

  socket.on('join', controller.join)
  socket.on('new message', controller.newMessage)
  socket.on('user typing', controller.userTyping)
  socket.on('disconnect', controller.disconnect)
}

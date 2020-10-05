const makeController = require('./controller')
const logger = require('../middleware/logger')

module.exports = io => socket => {
  const controller = makeController(io, socket)

  socket.use(logger(socket))

  socket.on('join', controller.join)
  socket.on('new message', controller.newMessage)
  socket.on('user typing', controller.userTyping)
  socket.on('disconnect', controller.disconnect)
}

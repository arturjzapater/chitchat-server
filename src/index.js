const http = require('http')
const socket = require('socket.io')

const app = require('./app')
const users = require('./lib/users')

const { PORT = 5000 } = process.env

const server = http.createServer(app)
const io = socket(server).of('/socket')

io.on('connection', socket => {
  console.log('New connection')

  socket.on('join', name => {
    if (users.nicknameExists(name)) {
      socket.emit('nickname taken')
      return
    }

    socket.id = users.add(name)
    socket.nickname = name
    console.log(socket.id, socket.nickname)
    io.emit('new user', users.list())
  })

  socket.on('new message', message => {
    io.emit('new message', {
      user: socket.nickname,
      text: message,
      timestamp: Date.now()
    })
  })

  socket.on('user typing', isTyping => {
    io.emit('user typing', { socket, isTyping })
  })

  socket.on('disconnect', () => {
    console.log(`${socket.nickname} left (${socket.id})`)
    io.emit('user left', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

const handleExit = () => {
  console.log('Shutting down server.')
  process.exit()
}

process.on('SIGINT', handleExit)
process.on('SIGTERM', handleExit)

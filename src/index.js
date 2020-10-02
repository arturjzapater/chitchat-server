const http = require('http')
const socket = require('socket.io')

const app = require('./app')
const users = require('./users')

const { PORT = 5000 } = process.env

const server = http.createServer(app)
const io = socket(server).of('/socket')

io.on('connection', socket => {
  console.log('New connection', socket.id)

  socket.on('join', name => {
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
  })

  socket.on('new message', message => {
    io.emit('new message', {
      user: socket.nickname,
      text: message,
      timestamp: Date.now(),
      type: 'user'
    })
  })

  socket.on('user typing', isTyping => {
    io.emit('user typing', { socket, isTyping })
  })

  socket.on('disconnect', () => {
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

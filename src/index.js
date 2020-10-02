const http = require('http')
const socketIO = require('socket.io')

const app = require('./app')
const chatroom = require('./chatroom')

const { PORT = 5000 } = process.env

const server = http.createServer(app)
const io = socketIO(server).of('/socket')

io.on('connection', chatroom(io))

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

const handleExit = () => {
  console.log('Shutting down server.')
  process.exit()
}

process.on('SIGINT', handleExit)
process.on('SIGTERM', handleExit)

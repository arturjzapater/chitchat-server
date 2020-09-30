const http = require('http')
const socket = require('socket.io')

const app = require('./app')

const { PORT = 5000 } = process.env

const server = http.createServer(app)
const io = socket(server)

io.on('connection', socket => {
  console.log(`${socket} connected`)
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

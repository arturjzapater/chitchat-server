const express = require('express')
const http = require('http')
const socket = require('socket.io')

const { PORT = 5000 } = process.env

const app = express()
const server = http.createServer(app)
const io = socket(server)

io.on('connection', socket => {
  console.log(`${socket} connected`)
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

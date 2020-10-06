const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const usersApi = require('./users/routes')
const { url } = require('../config/client')

const { Router } = express
const { NODE_ENV = 'development' } = process.env
const logger = NODE_ENV === 'development'
  ? 'dev'
  : 'short'

const app = express()

if (NODE_ENV !== 'test') app.use(morgan(logger))
app.use(express.static(path.resolve('..', '..', 'client', 'dist')))
app.use('/api/users', cors({ origin: url }), usersApi({ Router }))

app.get('/*', (req, res) => {
  NODE_ENV === 'production'
    ? res.sendFile(path.resolve('../../client/dist/index.html'))
    : res.redirect('http://localhost:3000')
})

module.exports = app

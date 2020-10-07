const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const usersApi = require('./users/routes')
const { url: clientUrl } = require('../config/client')

const { Router } = express
const { NODE_ENV = 'development' } = process.env
const logger = NODE_ENV === 'development'
  ? 'dev'
  : 'short'

const app = express()

if (NODE_ENV !== 'test') app.use(morgan(logger))

app.get('/', (req, res) => {
  res.redirect(clientUrl)
})

app.use('/api/users', cors({ origin: clientUrl }), usersApi({ Router }))

module.exports = app

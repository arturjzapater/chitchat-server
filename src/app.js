const express = require('express')
const morgan = require('morgan')
const path = require('path')
const usersApi = require('./users/routes')

const { Router } = express
const { NODE_ENV = 'development' } = process.env
const logger = NODE_ENV === 'development'
  ? 'dev'
  : 'short'

const app = express()

app.use(morgan(logger))
app.use(express.static(path.resolve('..', '..', 'client', 'dist')))
app.use('/api/users', usersApi({ Router }))

module.exports = app

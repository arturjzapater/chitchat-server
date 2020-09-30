const express = require('express')
const morgan = require('morgan')
const path = require('path')

const { NODE_ENV = 'development' } = process.env
const logger = NODE_ENV === 'development'
  ? 'dev'
  : 'short'

const app = express()

app.use(morgan(logger))
app.use(express.static(path.resolve('..', '..', 'client', 'dist')))

module.exports = app

'use strict'

const _ = require('lodash')
const http = require('http')

const config = require('./config')
const app = require('./src/app')

const PORT = _.get(config, 'port')

require('./db')

const server = http.createServer(app.callback())

server.listen(PORT, () => console.log(`Server is started at port: ${PORT}`))

process.on('uncaughtError', (err) => {
  console.log(`Uncaught Error: ${err}`)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection: ${err}`)
  process.exit(1)
})

module.exports = server

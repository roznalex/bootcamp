'use strict'

const path = require('path')

module.exports = {
  port: 3000,
  api: {
    github: {
      url: 'https://api.github.com'
    }
  },
  db: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'bootcamp'
    },
    migrations: {
      directory: path.join(process.cwd(), './db/migrations')
    },
    pool: {
      min: 1,
      max: 20
    }
  }
}

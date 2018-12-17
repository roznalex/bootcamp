'use strict'

const db = require('../db')

db.migrate.latest()
  .then(() => {
    console.log('Migrations are finished')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

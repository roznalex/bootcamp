'use strict'

const db = require('../db')

db.migrate.rollback()
  .then(() => {
    console.log('The latest migration group is canceled')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

'use strict'

const tableName = 'repository'

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').unsigned().primary()
    table.integer('owner').unsigned().notNullable()
    table.foreign('owner').references('user.id').onDelete('CASCADE')
    table.string('full_name', 255).notNullable()
    table.string('description', 255).notNullable()
    table.string('html_url', 255).notNullable()
    table.string('language', 255).notNullable()
    table.integer('stargazers_count').unsigned().notNullable()
  })
}

function down (knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}

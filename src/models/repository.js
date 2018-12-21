'use strict'

const _ = require('lodash')
const joi = require('joi')

const db = require('../../db')
const UserModel = require('./user')

const tableName = 'repository'

const insertValidationSchema = joi.object({
  id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
  owner: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
  full_name: joi.string().max(255),
  description: joi.string().max(255),
  html_url: joi.string().max(255).required(),
  language: joi.string().max(255).required(),
  stargazers_count: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required()
}).required()

async function insert (params) {
  const user = joi.attempt(params, insertValidationSchema)

  const [firstResult] = await db(tableName).insert(user).returning('*')

  return firstResult
}

const readValidationSchema = joi.object({
  id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER),
  full_name: joi.string().max(255)
}).required().xor('id', 'full_name')

async function read (params) {
  const selection = joi.attempt(params, readValidationSchema)

  return db
    .select(
      db.raw(`to_json(:tableName:.*) as :tableName:`, { tableName }),
      db.raw(`to_json(:userTableName:.*) as :userTableName:`, { userTableName: UserModel.tableName })
    )
    .from(tableName)
    .join(UserModel.tableName, `${tableName}.owner`, `${UserModel.tableName}.id`)
    .where(_.mapKeys(selection, (value, key) => `${tableName}.${key}`))
    .first()
}

module.exports = {
  tableName,
  insert,
  read
}

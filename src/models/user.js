'use strict'

const joi = require('joi')

const db = require('../../db')

const tableName = 'user'

const insertValidationSchema = joi.object({
  id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
  login: joi.string().max(255).required(),
  avatar_url: joi.string().max(255).required(),
  html_url: joi.string().max(255).required(),
  type: joi.string().max(255).required()
}).required()

async function insert (params) {
  const user = joi.attempt(params, insertValidationSchema)

  const [firstResult] = await db(tableName).insert(user).returning('*')

  return firstResult
}

const readValidationSchema = joi.object({
  id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER),
  login: joi.string().max(255)
}).required().or('id', 'login')

async function read (params) {
  const selection = joi.attempt(params, readValidationSchema)

  return db(tableName).where(selection).first()
}

module.exports = {
  tableName,
  insert,
  read
}

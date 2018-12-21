'use strict'

const _ = require('lodash')
const joi = require('joi')

const db = require('../../db')
const UserModel = require('./user')
const RepositoryModel = require('./repository')

const tableName = 'contribution'

const insertValidationSchema = joi.object({
  repository: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
  user: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required(),
  line_count: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required()
}).required()

async function insert (params) {
  const contribution = joi.attempt(params, insertValidationSchema)

  const [firstResult] = await db(tableName).insert(contribution).returning('*')

  return firstResult
}

async function insertOrReplace (params) {
  const contribution = joi.attempt(params, insertValidationSchema)

  const query = `
      INSERT INTO :tableName: (repository, "user", line_count)
      VALUES (:repository, :user, :line_count)
      ON CONFLICT (repository, "user") DO UPDATE
      SET line_count = :line_count
      RETURNING *;
  `

  const result = await db.raw(query, { ...contribution, tableName })

  return result.rows[0]
}

const readValidationSchema = joi.object({
  user: joi.object({
    id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER),
    login: joi.string().max(255)
  }).xor('id', 'login'),
  repository: joi.object({
    id: joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER),
    full_name: joi.string().max(255)
  }).xor('id', 'full_name')
}).or('user', 'repository').required()

async function read (params) {
  const { repository, user } = joi.attempt(params, readValidationSchema)

  let whereClause = {}

  if (repository) _.assign(whereClause, _.mapKeys(repository, (value, key) => `${RepositoryModel.tableName}.${key}`))

  if (user) _.assign(whereClause, _.mapKeys(user, (value, key) => `${UserModel.tableName}.${key}`))

  const result = await db
    .select(
      db.raw(`to_json(:tableName:.*) as :tableName:`, { tableName }),
      db.raw(`to_json(:repoTableName:.*) as :repoTableName:`, { repoTableName: RepositoryModel.tableName }),
      db.raw(`to_json(:userTableName:.*) as :userTableName:`, { userTableName: UserModel.tableName })
    )
    .from(tableName)
    .join(RepositoryModel.tableName, `${tableName}.repository`, `${RepositoryModel.tableName}.id`)
    .join(UserModel.tableName, `${tableName}.user`, `${UserModel.tableName}.id`)
    .where(whereClause)

  return _.map(result, ({ contribution, user, repository }) => ({
    user,
    repository,
    line_count: contribution.line_count
  }))
}

module.exports = {
  tableName,
  insert,
  insertOrReplace,
  read
}

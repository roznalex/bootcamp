'use strict'

const joi = require('joi')
const _ = require('lodash')

const config = require('./config')

require('dotenv').config({ path: 'config/.env' })

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('production'),
  LOGGER_LEVEL: joi.string()
    .allow(['test', 'error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .when('NODE_ENV', {
      is: 'development',
      then: joi.default('silly')
    })
    .when('NODE_ENV', {
      is: 'production',
      then: joi.default('info')
    })
    .when('NODE_ENV', {
      is: 'test',
      then: joi.default('warn')
    }),
  PORT: joi.string(),
  GITHUB_AUTH_TOKEN: joi.string().required(),
  PG_CONNECTION_STRING: joi.string(),
  PG_DATABASE: joi.string(),
  PG_MIGRATION_DIR: joi.string(),
  PG_POOL_MIN: joi.number().integer().min(1).max(20),
  PG_POOL_MAX: joi.number().integer().min(1).max(20),
  DB_DEBUG: joi.boolean().default(false)
})
  .unknown().required()

const envVars = joi.attempt(process.env, envVarsSchema)

const configFromEnv = {
  env: envVars.NODE_ENV,
  process: {
    type: envVars.PROCESS_TYPE
  },
  logger: {
    level: envVars.LOGGER_LEVEL
  },
  server: {
    port: envVars.PORT
  },
  api: {
    github: {
      authToken: envVars.GITHUB_AUTH_TOKEN
    }
  },
  db: {
    connection: envVars.PG_CONNECTION_STRING,
    migrations: envVars.PG_MIGRATION_DIR,
    pool: {
      min: envVars.PG_POOL_MIN,
      max: envVars.PG_POOL_MAX
    },
    debug: envVars.DB_DEBUG
  }
}

module.exports = _.merge(config, configFromEnv)

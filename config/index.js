const joi = require('joi')
const _ = require('lodash')

const config = require('./config.json')

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
  PORT: joi.string().required(),
  GITHUB_AUTH_TOKEN: joi.string().required()
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
  }
}

module.exports = _.merge(config, configFromEnv)

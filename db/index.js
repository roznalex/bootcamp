'use strict'

const _ = require('lodash')
const knex = require('knex')

const config = require('../config/index')

module.exports = knex(_.get(config, 'db'))

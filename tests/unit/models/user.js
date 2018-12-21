'use strict'

/* globals describe, it, afterEach */

const { expect } = require('chai')

const db = require('../../../db')
const User = require('../../../src/models/user')

describe('User model methods', () => {
  describe('insert', () => {
    it('should insert a user into database', async () => {
      const userParams = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }

      await User.insert(userParams)

      const user = await db(User.tableName).where({ id: userParams.id }).first()

      expect(user).to.deep.equal(userParams)
    })

    it('should throw a validation error', async () => {
      const userParams = {
        id: 1,
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }

      await User.insert(userParams).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      const user = await db(User.tableName).where({ id: userParams.id }).first()

      expect(user).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })

  describe('read', () => {
    it('should return a user from database', async () => {
      const userParams = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }

      await db(User.tableName).insert(userParams)

      const user = await User.read({ id: userParams.id })

      expect(user).to.deep.equal(userParams)
    })

    it('should throw a validation error', async () => {
      const user = await User.read({}).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      expect(user).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })
})

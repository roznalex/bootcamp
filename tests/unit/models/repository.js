'use strict'

/* globals describe, it, afterEach */

const { expect } = require('chai')

const db = require('../../../db')
const User = require('../../../src/models/user')
const Repository = require('../../../src/models/repository')

describe('Repository model methods', () => {
  describe('insert', () => {
    it('should insert a repository into database', async () => {
      const userParams = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }
      const repositoryParams = {
        id: 1,
        owner: 1,
        full_name: 'iwex/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/iwex',
        language: 'developer',
        stargazers_count: 100
      }

      await User.insert(userParams)
      await Repository.insert(repositoryParams)

      const repository = await db(Repository.tableName).where({ id: repositoryParams.id }).first()

      expect(repository).to.deep.equal(repositoryParams)
    })

    it('should throw a validation error', async () => {
      const repositoryParams = {
        id: 1,
        full_name: 'iwex/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/iwex',
        language: 'developer',
        stargazers_count: 100
      }

      await Repository.insert(repositoryParams).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      const repository = await db(Repository.tableName).where({ id: repositoryParams.id }).first()

      expect(repository).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })

  describe('read', () => {
    it('should return repository with owner from database', async () => {
      const selection = {
        id: 1
      }
      const userParams = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }
      const repositoryParams = {
        id: 1,
        owner: 1,
        full_name: 'iwex/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/iwex',
        language: 'developer',
        stargazers_count: 100
      }

      await db(User.tableName).insert(userParams)
      await db(Repository.tableName).insert(repositoryParams)

      const { repository, user } = await Repository.read(selection)

      expect(repository).to.deep.equal(repositoryParams)
      expect(user).to.deep.equal(userParams)
    })

    it('should throw a validation error', async () => {
      const repository = await Repository.read({}).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      expect(repository).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })
})

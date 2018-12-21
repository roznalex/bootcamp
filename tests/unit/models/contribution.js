'use strict'

/* globals describe, it, afterEach */

const { expect } = require('chai')

const db = require('../../../db')
const User = require('../../../src/models/user')
const Repository = require('../../../src/models/repository')
const Contribution = require('../../../src/models/contribution')

describe('Contribution model methods', () => {
  describe('insert', () => {
    it('should insert a contribution into database', async () => {
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
      const contributionParams = {
        repository: 1,
        user: 1,
        line_count: 10000
      }

      await User.insert(userParams)
      await Repository.insert(repositoryParams)
      await Contribution.insert(contributionParams)

      const contribution = await db(Contribution.tableName).where(contributionParams).first()

      expect(contribution).to.deep.equal(contributionParams)
    })

    it('should throw a validation error', async () => {
      const contributionParams = {
        repository: 1,
        line_count: 10000
      }

      await Contribution.insert(contributionParams).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      const contribution = await db(Contribution.tableName).where(contributionParams).first()

      expect(contribution).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })

  describe('insertOrReplace', () => {
    it('should replace a contribution into database', async () => {
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
      const contributionParams = {
        repository: 1,
        user: 1,
        line_count: 10000
      }
      const contributionReplaceParams = {
        repository: 1,
        user: 1,
        line_count: 10001
      }

      await User.insert(userParams)
      await Repository.insert(repositoryParams)
      await Contribution.insert(contributionParams)
      await Contribution.insertOrReplace(contributionReplaceParams)

      const contribution = await db(Contribution.tableName).where(contributionReplaceParams).first()

      expect(contribution).to.deep.equal(contributionReplaceParams)
    })

    it('should throw a validation error', async () => {
      const contributionParams = {
        repository: 1,
        line_count: 10000
      }

      await Contribution.insertOrReplace(contributionParams).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      const contribution = await db(Contribution.tableName).where(contributionParams).first()

      expect(contribution).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })

  describe('read', () => {
    it('should return array of contributions with repository and user if only user provided', async () => {
      const user1 = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }
      const user2 = {
        id: 2,
        login: 'rozn',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/rozn',
        type: 'developer'
      }
      const repo1 = {
        id: 1,
        owner: 1,
        full_name: 'iwex/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/iwex',
        language: 'developer',
        stargazers_count: 100
      }
      const repo2 = {
        id: 2,
        owner: 2,
        full_name: 'rozn/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/rozn',
        language: 'developer',
        stargazers_count: 100
      }
      const contribution1 = {
        repository: 1,
        user: 1,
        line_count: 10000
      }
      const contribution2 = {
        repository: 2,
        user: 2,
        line_count: 10000
      }
      const selection1 = {
        user: {
          id: 1
        }
      }

      await db(User.tableName).insert([user1, user2])
      await db(Repository.tableName).insert([repo1, repo2])
      await db(Contribution.tableName).insert([contribution1, contribution2])

      const contributions = await Contribution.read(selection1)

      expect(contributions).to.deep.equal([{
        line_count: contribution1.line_count,
        user: user1,
        repository: repo1
      }])
    })

    it('should return array of contributions with repository and user if only repository provided', async () => {
      const user1 = {
        id: 1,
        login: 'iwex',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/iwex',
        type: 'developer'
      }
      const user2 = {
        id: 2,
        login: 'rozn',
        avatar_url: 'https://avatars1.githubusercontent.com/u/4510068',
        html_url: 'https://github.com/rozn',
        type: 'developer'
      }
      const repo1 = {
        id: 1,
        owner: 1,
        full_name: 'iwex/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/iwex',
        language: 'developer',
        stargazers_count: 100
      }
      const repo2 = {
        id: 2,
        owner: 2,
        full_name: 'rozn/repo',
        description: 'Bla bla bla',
        html_url: 'https://github.com/rozn',
        language: 'developer',
        stargazers_count: 100
      }
      const contribution1 = {
        repository: 1,
        user: 1,
        line_count: 10000
      }
      const contribution2 = {
        repository: 2,
        user: 2,
        line_count: 10000
      }
      const selection1 = {
        repository: {
          id: 1
        }
      }

      await db(User.tableName).insert([user1, user2])
      await db(Repository.tableName).insert([repo1, repo2])
      await db(Contribution.tableName).insert([contribution1, contribution2])

      const contributions = await Contribution.read(selection1)

      expect(contributions).to.deep.equal([{
        line_count: contribution1.line_count,
        user: user1,
        repository: repo1
      }])
    })

    it('should throw a validation error', async () => {
      const contribution = await Contribution.read({}).catch((err) => {
        expect(err).to.be.an('error')
        expect(err.name).to.equal('ValidationError')
      })

      expect(contribution).to.equal(undefined)
    })

    afterEach('Cleanup', () => db(User.tableName).delete())
  })
})

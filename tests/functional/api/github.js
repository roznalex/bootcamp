/* globals describe, it, */

const _ = require('lodash')
const nock = require('nock')
const { expect } = require('chai')

const config = require('../../../config')
const GithubAPI = require('../../../src/api/Github')

const { url, authToken } = _.get(config, 'api.github')
const githubAPI = new GithubAPI({ url, authToken })

describe('Github API:', () => {
  describe('GET /search/repositories', () => {
    it('should get repositories', async () => {
      const requestQuery = { q: 'language:javascript' }

      const expectedResponseData = { items: [] }
      const expectedStatus = 200

      const requestToGetRepositories = nock(url)
        .get('/search/repositories')
        .query(requestQuery)
        .reply(200, expectedResponseData)
      const result = await githubAPI.searchRepositories(requestQuery)

      expect(result.data).to.deep.equal(expectedResponseData)
      expect(result.status).to.equal(expectedStatus)
      expect(requestToGetRepositories.isDone()).to.equal(true)
    })
  })

  describe('GET /repos/:repository/stats/contributors', () => {
    it('should get getContributors by a repository', async () => {
      const repository = 'owner/repo'

      const expectedResponseData = [{ author: {}, weeks: [] }]
      const expectedStatus = 200

      const requestToGetContributors = nock(url)
        .get(`/repos/${repository}/stats/contributors`)
        .reply(200, expectedResponseData)
      const result = await githubAPI.getContributors(repository)

      expect(result.data).to.deep.equal(expectedResponseData)
      expect(result.status).to.equal(expectedStatus)
      expect(requestToGetContributors.isDone()).to.equal(true)
    })
  })
})

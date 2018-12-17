'use strict'

const axios = require('axios')

module.exports = class GithubAPI {
  constructor (options) {
    const { authToken, url } = options

    this.url = url
    this.authToken = authToken
  }

  searchRepositories (query = {}) {
    return axios({
      url: '/search/repositories',
      method: 'GET',
      baseURL: this.url,
      headers: {
        Authorization: `bearer ${this.authToken}`,
        Accept: 'application/json'
      },
      params: query
    })
  }

  getContributors (repository, query = {}) {
    return axios({
      url: `/repos/${repository}/stats/contributors`,
      method: 'GET',
      baseURL: this.url,
      headers: {
        Authorization: `bearer ${this.authToken}`,
        Accept: 'application/json'
      },
      params: query
    })
  }
}

/* globals describe, it */

const chai = require('chai')
const chaiHTTP = require('chai-http')

const server = require('../../index')

chai.use(chaiHTTP)

const expect = chai.expect

describe('HELLO API: ', () => {
  describe('GET /hello', () => {
    it('should return a greetings string', async () => {
      const res = await chai.request(server).get('/hello')

      expect(res).to.have.status(200)
      expect(res.text).to.equal('Hello Node.js!')
    })
  })
})

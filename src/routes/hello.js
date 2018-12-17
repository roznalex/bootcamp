'use strict'

const Router = require('koa-router')

const router = new Router({ prefix: '/hello' })

router.get('/', ctx => (ctx.body = 'Hello Node.js!'))

module.exports = router

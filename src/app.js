const Koa = require('koa')

const initRoutes = require('./routes')

const app = new Koa()

app.on('error', (err, ctx) => {
  console.log(err)
  ctx.body = 'Something wrong'
})

initRoutes(app)

module.exports = app

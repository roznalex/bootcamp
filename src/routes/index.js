const helloRouter = require('./hello')

module.exports = (app) => {
  app.use(helloRouter.routes())
}

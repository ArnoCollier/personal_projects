const Router = require('@koa/router');
const installReservatieRouter = require('../rest/reservatie');
const installBoekRouter = require('../rest/boek');
const installUserRouter = require('../rest/user');
const installHealthRouter = require('../rest/health');
const installAuteurRouter = require('../rest/auteur')

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installReservatieRouter(router);
  installBoekRouter(router);
  installUserRouter(router);
  installHealthRouter(router);
  installAuteurRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};

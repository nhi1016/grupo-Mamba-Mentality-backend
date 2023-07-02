const Router = require('koa-router');
// const knex = require('../controllers/knex');

const router = new Router();

router.post('/', async (ctx) => {
  const reqBody = ctx.request.body;
  console.log(reqBody);
  ctx.body = '<h1>Recibido</h1>';
});

router.get('/', async (ctx) => {
  ctx.body = '<h1>Bienvenido a MemoryMatrix</h1>';
});

module.exports = router;

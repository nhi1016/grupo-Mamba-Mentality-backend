const Router = require('koa-router');
const knex = require('../controllers/knex');

const router = new Router();

router.post('/operacion', async (ctx) => {
  const argumentos = ctx.request.body;

  ctx.body = argumentos;
});

router.get('', async (ctx) => {
  const res = await knex.raw('SELECT * FROM Usuario;');
  ctx.body = res.rows;
});

module.exports = router;

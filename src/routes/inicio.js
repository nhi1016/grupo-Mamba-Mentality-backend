const Router = require('koa-router');
const knex = require('../controllers/knex');

const router = new Router();

router.post('/', async (ctx) => {
  const reqBody = ctx.request.body;
  console.log(reqBody);
  ctx.body = '<h1>Recibido</h1>';
});

router.get('/', async (ctx) => {
  const res = await knex.raw('SELECT * FROM Usuario;');
  ctx.body = res.rows;
});

module.exports = router;

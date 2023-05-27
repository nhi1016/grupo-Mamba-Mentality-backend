import Router from 'koa-router';
import knex from '../controllers/dbKnex.js';

const router = new Router();

router.post('/operacion', async (ctx) => {
  const argumentos = ctx.request.body;

  ctx.body = argumentos;
});

router.get('', async (ctx) => {
	const response = await knex('Usuario').select('*');
    ctx.body = JSON.stringify(response);
});

export default router;

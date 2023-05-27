import Router from 'koa-router';
import knex from '../controllers/dbKnex.js';

const router = new Router();

router.post('/operacion', async (ctx) => {
  const argumentos = ctx.request.body;

  ctx.body = argumentos;
});

router.get('hola', async (ctx) => {
	const response = await knex('Usuario').select('*').where('id', '=', 1);
    ctx.body = JSON.stringify(response);
});

export default router;

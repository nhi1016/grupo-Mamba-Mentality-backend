import Router from 'koa-router';
import inicio from './routes/inicio.js';

const router = new Router();

router.use('/', inicio.routes());

export default router;

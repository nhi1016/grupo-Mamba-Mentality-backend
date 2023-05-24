import Router from "koa-router";

const router = new Router();

router.post('/operacion', async (ctx) => {
    const argumentos = ctx.request.body;

    ctx.body = argumentos;
});

router.get('/', async (ctx) => {
    ctx.body = "<h1>Hola tu, bienvenido</h1>";
});

export default router;
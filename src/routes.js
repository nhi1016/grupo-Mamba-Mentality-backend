const Router = require('koa-router');
const inicio = require('./routes/inicio.js');

const router = new Router();

router.use('/', inicio.routes());

module.exports = router;

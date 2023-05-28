const Router = require('koa-router');
const inicio = require('./routes/inicio');
const juego = require('./routes/juego');

const router = new Router();

router.use('/', inicio.routes());
router.use('/Game', juego.routes());

module.exports = router;

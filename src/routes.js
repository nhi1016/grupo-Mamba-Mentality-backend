const Router = require('koa-router');
const inicio = require('./routes/inicio');
const juego = require('./routes/juego');
const logicaPartida = require('./routes/logicaPartida');

const router = new Router();

router.use('/', inicio.routes());
router.use('/newGame', juego.routes());
router.use('/Game', logicaPartida.routes());

module.exports = router;

const Router = require('koa-router');
const knex = require('../controllers/knex');

const router = new Router();

router.post('/FreeTrial', async (ctx) => {
  const reqBody = ctx.request.body;
  console.log(reqBody);
  // retornar 
  // usuario, vidas, tiempo restante
  // tamaño tablero, imagenes tablero, todos bonus
  const response = {
    usuario: {
      nickname: reqBody.nickname,
      vidas: undefined,
    },
    tablero: {
      tiempo_restante: undefined,
      tamano: undefined,
      imagenes: [],
      bonus: [],
    },
  };
  const res = await knex.raw(
    `SELECT U.nickname, P.vidas, P.tiempo_restante, T.tamano AS tamano_tablero, B.tipo AS tipo_bonus, B.descripcion AS bonus_descripcion
    FROM Usuario U, Historial H, Partida P, Tablero T, Tablero_Partida TP, Bonus B, Partida_Bonus PB
    WHERE U.nickname = '${reqBody.nickname}'
    AND H.id_usuario = U.id
    AND P.id = H.id_partida
    AND TP.id_partida = P.id
    AND T.id = TP.id_tablero
    AND P.id = PB.id_partida
    AND PB.id_bonus = B.id;`,
  );
  response.usuario.vidas = res.rows[0].vidas;
  response.tablero.tiempo_restante = res.rows[0].tiempo_restante;
  response.tablero.tamano = res.rows[0].tamano_tablero;
  response.tablero.bonus = [
    {
      tipo: res.rows[0].tipo_bonus,
      descripsion: res.rows[0].bonus_descripcion,
    },
    {
      tipo: res.rows[1].tipo_bonus,
      descripsion: res.rows[1].bonus_descripcion,
    },
    {
      tipo: res.rows[2].tipo_bonus,
      descripsion: res.rows[2].bonus_descripcion,
    },
  ]
  ctx.body = response;
});

router.post('/:nickname', async (ctx) => {
  const reqBody = ctx.request.body;
  console.log(reqBody);
  // retornar 
  // usuario, vidas, tiempo restante
  // tamaño tablero, imagenes tablero, algunos bonus
  const response = {
    usuario: {
      nickname: reqBody.nickname,
      vidas: undefined,
    },
    tablero: {
      tamano: undefined,
      imagenes: [],
      bonus: [],
    },
  };
  const res = await knex.raw(
    `SELECT * FROM Usuario U, Partida P, Historial H 
    WHERE U.nickname = '${reqBody.nickname}'
    AND H.id_usuario = U.id
    AND P.id = H.id_partida;`,
  );
  ctx.body = res.rows;
});

module.exports = router;

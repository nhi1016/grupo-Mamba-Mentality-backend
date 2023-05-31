const Router = require('koa-router');
const knex = require('../controllers/knex');
const fs = require('fs');
const path = require('node:path');
const { request } = require('http');

const router = new Router();

// Funciones a usar posteriormente
function data64(pathData) {
  return new Promise((res, rej) => {
    fs.readFile(pathData, 'base64', (err, data) => {
      if (err) {
        rej(err);
      } else {
        res('data:image/png;base64,' + data);
      }
    });
  });
}
async function asyncFor(iterable, out) {
  await Promise.all(iterable.map(async (imagen, index) => {
    const imgPath = path.join(__dirname, imagen.ruta, imagen.nombre);
    const img64 = await data64(imgPath);
    out[index] = {
      id: imagen.id,
      imagen: img64,
    };
  }));
}
// --------------------------------------

// Crear partida de prueba de usuario no registrado
router.get('/FreeTrial', async (ctx) => {
  // const reqBody = ctx.request.body;
  // console.log(reqBody);

  // Consulta por datos del usuario
  const nicknameDefault = await knex.raw('SELECT nickname FROM Usuario WHERE id = 1');
  const response = {
    usuario: {
      nickname: nicknameDefault.rows[0].nickname,
      vidas: undefined,
    },
    tablero: {
      tiempo_restante: undefined,
      tamano: undefined,
      bonus: [],
      imagenes: [],
    },
  };
  // Consulta para datos del tablero
  const res = await knex.raw(
    `SELECT U.nickname, P.vidas, P.tiempo_restante, T.tamano AS tamano_tablero, B.tipo AS tipo_bonus, B.descripcion AS bonus_descripcion
    FROM Usuario U, Historial H, Partida P, Tablero T, Tablero_Partida TP, Bonus B, Partida_Bonus PB
    WHERE U.nickname = '${response.usuario.nickname}'
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
  ];
  // Consulta de imagenes
  const imagenes = await knex.raw("SELECT * FROM IMAGEN WHERE dificultad = 'facil' LIMIT 8;");

  // Codificar imagenes
  await asyncFor(imagenes.rows, response.tablero.imagenes);

  ctx.body = response;
  ctx.status = 200;
});

// Crear nueva partida de usuario registrado
router.get('/:nickname', async (ctx) => {
  const reqBody = ctx.params;

  const response = {
    usuario: {
      nickname: reqBody.nickname,
    },
    partida: {
      id: undefined,
      vidas: undefined,
      tablero: {
        tamano: undefined,
        bonus: [],
        imagenes: [],
      },
    }
  };
  // Revisamos el nivel de dificultad de la última partida
  const nivel = await knex.raw(
    `SELECT U.id, U.nickname, T.tamano, T.dificultad FROM Usuario U, Historial H, Partida P, Tablero_Partida TP, Tablero T
    WHERE U.nickname = '${reqBody.nickname}'
    AND U.id = H.id_usuario
    AND H.id_partida = P.id
    AND P.id = TP.id_partida
    AND TP.id_tablero = T.id
    ORDER BY H.fecha DESC
    LIMIT 1;`
    );
    response.partida.tablero.tamano = nivel.rows[0].tamano;

    // Consulta de imagenes
  const imagenes = await knex.raw(
    `SELECT * FROM Imagen
    WHERE dificultad = '${nivel.rows[0].dificultad}'
    LIMIT ${nivel.rows[0].tamano};`
    );

  // Codificar imagenes
  await asyncFor(imagenes.rows, response.partida.tablero.imagenes);

  // Creación de nueva partida
  const maxIdPartida = await knex.raw(
    `SELECT max(id) FROM Partida;`
  );
  response.partida.id = maxIdPartida.rows[0].max + 1;
  await knex.raw(
    `INSERT INTO Partida (id) VALUES (${maxIdPartida.rows[0].max}+1);`
  ).then(async () => {
    // Creacion de Historial
    const date = new Date();
    await knex.raw(
      `INSERT INTO Historial (id_usuario, id_partida, fecha)
      VALUES (${nivel.rows[0].id}, ${response.partida.id}, '${date.toISOString().replace('T', ' ').replace('Z', '')}')`
    );
  });


  console.log(response)
  ctx.body = response;
});

// Guardar partida de usuario registrado
router.post('', async () => {});

module.exports = router;

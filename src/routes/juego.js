const Router = require('koa-router');
const knex = require('../controllers/knex');
const fs = require('fs');
const path = require('node:path');

const router = new Router();

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
      imagenes: [],
      bonus: [],
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
  const imagenes = await knex.raw("SELECT * FROM IMAGEN WHERE dificultad = 'facil' LIMIT 2;");
  const listaImagenes = [];

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
  await Promise.all(imagenes.rows.map(async (tupla) => {
    const imgPath = path.resolve(__dirname, '..', 'models', 'images', tupla.nombre);
    const img64 = await data64(imgPath);
    listaImagenes.push({
      id: tupla.id,
      imagen: img64,
    });
  }));
  
  response.tablero.imagenes = listaImagenes;

  ctx.body = response;
  ctx.status = 200;
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

// const imagenes = await knex.raw("SELECT * FROM IMAGEN WHERE dificultad = 'facil' LIMIT 2;");
// const listaImagenes = [];

// await Promise.all(imagenes.rows.map(async (tupla, index) => {
//   const imgPath = path.format({
//     dir: __dirname,
//     base: path.join(tupla.ruta, tupla.nombre),
//   });

//   const img64 = await new Promise((resolve, reject) => {
//     fs.readFile(imgPath, 'base64', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });

//   listaImagenes.push({
//     id: tupla.id,
//     imagen: 'data:image/png;base64,' + img64,
//   });
// }));

// response.tablero.imagenes = listaImagenes;



// const cargarImagenes = new Promise((res) => {
//   const listaImagenes = [];
//   imagenes.rows.forEach((tupla) => {
//     console.log(tupla);
//     const imgPath = path.format({
//       dir: __dirname,
//       base: path.join(tupla.ruta, tupla.nombre),
//     });
//     fs.readFile(imgPath, 'base64', (err, img64) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       listaImagenes.push({
//         id: tupla.id,
//         imagen: 'data:image/png;base64,' + img64,
//       });
//     });
//   });
//   response.tablero.imagenes = listaImagenes;
//   res('ok');
// });
// await cargarImagenes;

// const algo = new Promise((r) => {
//   setTimeout(() => {
//     console.log('algo')
//     r('yes');
//   }, '4000')
  
// })
// await algo;
const Router = require('koa-router');
const knex = require('../controllers/knex');
const fs = require('fs');
const path = require('node:path');

const router = new Router();

// =====================================================
//      Funciones a usar posteriormente
// =====================================================
function data64(pathData) {
  return new Promise((res, rej) => {
    fs.readFile(pathData, 'base64', (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(`data:image/png;base64,${data}`);
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
      // imagen: img64,
      posicion: index,
    };
  }));
}
// =====================================================

// =====================================================
// Crear partida de prueba de usuario no registrado
// =====================================================
router.get('/FreeTrial', async (ctx) => {
  const response = {
    usuario: {
      nickname: undefined,
      id: undefined,
    },
    partida: {
      id: undefined,
      vidas: undefined,
      score: undefined,
      tiempo_restante: undefined,
      titulo: undefined,
      dificultad: undefined,
    },
    tablero: {
      id: undefined,
      tamano: undefined,
      bonus: [],
      imagenes: [],
    },
  };

  // Consulta usuario default
  const usuarioDefault = await knex.raw('SELECT nickname, password FROM Usuario WHERE id = 1');
  // Crear usuario default
  await knex.raw(
    'SELECT MAX(id) FROM Usuario',
  ).then(async (maxIdUsuario) => {
    const newId = maxIdUsuario.rows[0].max + 1;
    const newNickname = usuarioDefault.rows[0].nickname;
    const newPass = usuarioDefault.rows[0].password;
    response.usuario.id = newId;
    response.usuario.nickname = newNickname;
    await knex.raw(
      `INSERT INTO Usuario (id, nickname, password)
      VALUES (${newId}, '${newNickname} ${newId}', '${newPass}')`,
    );
  });
  // Obtener partida default
  await knex.raw(
    `SELECT P.score, P.vidas, P.tiempo_restante, P.titulo, T.tamano, T.dificultad
    FROM Partida P, Tablero T
    WHERE P.id = 1
    AND T.id = 1`,
  ).then(async (partidaDefault) => {
    const newScore = partidaDefault.rows[0].score;
    const newVidas = partidaDefault.rows[0].vidas;
    const newTiempo = partidaDefault.rows[0].tiempo_restante;
    const newTitulo = partidaDefault.rows[0].titulo;
    const newTamano = partidaDefault.rows[0].tamano;
    const newDificultad = partidaDefault.rows[0].dificultad;
    response.partida.score = newScore;
    response.partida.vidas = newVidas;
    response.partida.tiempo_restante = newTiempo;
    response.partida.titulo = `${newTitulo} ${response.usuario.id}`;
    response.tablero.tamano = newTamano;
    response.partida.dificultad = newDificultad;
    // Crear nueva partida default
    await knex.raw(
      'SELECT MAX(P.id) AS P_max, MAX(T.id) AS T_max FROM Partida P, Tablero T',
    ).then(async (maxId) => {
      const newIdPartida = maxId.rows[0].p_max + 1;
      const newIdTablero = maxId.rows[0].t_max + 1;
      response.partida.id = newIdPartida;
      response.tablero.id = newIdTablero;
      await knex.raw(
        `INSERT INTO Partida (id, score, vidas, tiempo_restante, titulo) 
        VALUES (${newIdPartida}, ${newScore}, ${newVidas}, ${newTiempo}, '${newTitulo}')`,
      );
      // Crear Tablero Default
      await knex.raw(
        `INSERT INTO Tablero (tamano, dificultad) 
        VALUES (${newTamano}, '${newDificultad}')`,
      );
      // Crear relacion Tablero_Partida
      await knex.raw(
        `INSERT INTO Tablero_Partida (id_partida, id_tablero) 
        VALUES (${newIdPartida}, ${newIdTablero})`,
      );
      // Crear relacion Histrial
      const date = new Date();
      const newFecha = date.toISOString().replace('T', ' ').replace('Z', '');
      await knex.raw(
        `INSERT INTO Historial (id_usuario, id_partida, fecha)
        VALUES (${response.usuario.id}, ${newIdPartida}, '${newFecha}')`,
      );
    });
  });
  // Anadir Bonus a la partida y a la relacion Partida_Bonus
  await knex.raw(
    'SELECT * FROM Bonus',
  ).then(async (resQuery) => {
    const bonus = resQuery.rows;
    response.tablero.bonus = [
      {
        id: bonus[0].id,
        tipo: bonus[0].tipo,
        descripcion: bonus[0].descripcion,
        usado: 0,
      },
      {
        id: bonus[1].id,
        tipo: bonus[1].tipo,
        descripcion: bonus[1].descripcion,
        usado: 0,
      },
      {
        id: bonus[2].id,
        tipo: bonus[2].tipo,
        descripcion: bonus[2].descripcion,
        usado: 0,
      },
    ];
    // Relacion Partida_Bonus
    await Promise.all(
      bonus.map(async (b) => {
        await knex.raw(
          `INSERT INTO Partida_Bonus (id_partida, id_bonus)
          VALUES (${response.partida.id}, ${b.id})`,
        );
      }),
    );
  });
  // Buscar imagenes para el tablero
  await knex.raw(
    `SELECT * FROM IMAGEN 
    WHERE dificultad = '${response.partida.dificultad}' 
    LIMIT ${response.tablero.tamano ** 2 / 2}`,
  ).then(async (resQuery) => {
    const imagenes = resQuery.rows;
    // Codificar imagenes
    await asyncFor(imagenes, response.tablero.imagenes);
    // Crear nueva relacion Tablero_Imagenes
    await Promise.all(
      imagenes.map(async (img) => {
        await knex.raw(
          `INSERT INTO Tablero_Imagenes (id_tablero, id_imagen)
          VALUES (${response.tablero.id}, ${img.id})`,
        );
      }),
    );
  });

  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

// -----------------------------------------------------

// =====================================================
// Crear nueva partida de usuario registrado
// =====================================================
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
    },
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
    LIMIT 1;`,
  );
  response.partida.tablero.tamano = nivel.rows[0].tamano;

  // Consulta de imagenes
  const imagenes = await knex.raw(
    `SELECT * FROM Imagen
    WHERE dificultad = '${nivel.rows[0].dificultad}'
    LIMIT ${nivel.rows[0].tamano};`,
  );

  // Codificar imagenes
  await asyncFor(imagenes.rows, response.partida.tablero.imagenes);

  // Creación de nueva partida
  const maxIdPartida = await knex.raw(
    'SELECT max(id) FROM Partida;',
  );
  response.partida.id = maxIdPartida.rows[0].max + 1;
  await knex.raw(
    `INSERT INTO Partida (id) VALUES (${maxIdPartida.rows[0].max}+1);`,
  ).then(async () => {
    // Creacion de Historial
    const date = new Date();
    await knex.raw(
      `INSERT INTO Historial (id_usuario, id_partida, fecha)
      VALUES (${nivel.rows[0].id}, ${response.partida.id}, '${date.toISOString().replace('T', ' ').replace('Z', '')}')`,
    );
  });

  // Creacion del tablero
  await knex.raw(
    'SELECT max(id) FROM Tablero',
  ).then(async (maxIdTablero) => {
    await knex.raw(
      `INSERT INTO Tablero (tamano, dificultad) 
      VALUES (${nivel.rows[0].tamano}, '${nivel.rows[0].dificultad}')`,
    );
    // Relacionar Tablero con Partida
    const newIdPartida = maxIdPartida.rows[0].max + 1;
    const newIdTablero = maxIdTablero.rows[0].max + 1;
    await knex.raw(
      `INSERT INTO Tablero_Partida (id_partida, id_tablero) 
      VALUES (${newIdPartida}, ${newIdTablero})`,
    );
  });

  ctx.body = response;
});
// =====================================================
// =====================================================

// =====================================================
// Guardar partida de usuario registrado
// =====================================================
router.post('/Save', async (ctx) => {
  const reqBody = ctx.request.body;

});
// =====================================================
// =====================================================

module.exports = router;

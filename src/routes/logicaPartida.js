/* eslint-disable array-callback-return */
const Router = require('koa-router');
const knex = require('../controllers/knex');

const router = new Router();

// =====================================================
//   Relacion de imagenes
// =====================================================
router.post('/checkimages', async (ctx) => {
  const reqBody = ctx.request.body;

  const response = {
    partida: {
      vidas: undefined,
      activa: 1, // Bool, para seguir jugando debe ser 1
      score: undefined,
    },
    relacion_imagenes: undefined, // booleano {1 o 0}
    comentario: [], // no es necesario para el funcionamiento
    imagenes: [],
    estado: 'ok',
  };

  // const resQuery = await knex.raw(
  //   `SELECT RI.id_img2 AS id_img2 FROM R_Im_Im RI
  //       WHERE RI.id_img1 = ${reqBody.id_img1}`,
  // );
  await knex('r_im_im AS RI')
    .select('RI.id_img2 AS id_img2')
    .where('RI.id_img1', reqBody.id_img1)
    .then(async (resQuery) => {
      if (resQuery[0].id_img2 === reqBody.id_img2) {
        // Las imágenes coinsiden
        response.relacion_imagenes = 1;
        response.partida.vidas = reqBody.partida.vidas;
        response.comentario.push('Relación entre imagenes correcta');
        // await knex.raw(
        //   `UPDATE Tablero_Imagenes
        //   SET enlazada = 1, visible = 1, bloqueada = 1
        //   WHERE id_tablero = ${reqBody.tablero.id}
        //   AND (
        //     id_imagen = ${reqBody.id_img1}
        //     OR id_imagen = ${reqBody.id_img2}
        //     )`,
        // );
        await knex('tablero_imagenes')
          .where('id_tablero', reqBody.tablero.id)
          .whereIn('id_imagen', [reqBody.id_img1, reqBody.id_img2])
          .update({
            enlazada: 1,
            visible: 1,
            bloqueada: 1,
          });
        response.comentario.push('Se bloquearan y se pondrán visibles las imagenes enlazadas');
        response.imagenes = [
          {
            id: reqBody.id_img1,
            visible: 1,
            enlazada: 1,
            bloqueada: 1,
          }, {
            id: reqBody.id_img2,
            visible: 1,
            enlazada: 1,
            bloqueada: 1,
          }];
        // Revision si estan todas las imagenes enlazadas, es decir, terminó el juego
        // await knex.raw(
        //   `SELECT SUM(enlazada) FROM Tablero_Imagenes
        //   WHERE id_tablero = ${reqBody.tablero.id}`,
        //   )
        await knex('tablero_imagenes')
          .where('id_tablero', reqBody.tablero.id)
          .sum('enlazada')
          .then(async (resQuery) => {
            // const res = await knex.raw(`SELECT * FROM Tablero WHERE id = ${reqBody.tablero.id}`);
            const res = await knex('tablero').select('*').where('id', reqBody.tablero.id);
            const tablero = res[0];
            const cantidadEnlazada = resQuery[0].sum;
            const cantidadDeImagenes = tablero.tamano ** 2;
            if (cantidadEnlazada >= cantidadDeImagenes) {
              response.partida.activa = 0;
              response.comentario.push('!! Genial ¡¡ ganaste, haz enlazado todas las imagenes correctamente');
              // Asignacion de puntaje
              // await knex.raw(
              //   `SELECT * FROM Partida P
              //   WHERE P.id = ${reqBody.partida.id}`,
              //   )
              await knex('partida AS P')
                // .select('*')
                .where('P.id', reqBody.partida.id)
                .then(async (resQuery) => {
                  const partida = resQuery[0];
                  const tiempoDisponible = partida.tiempo_restante;
                  const tiempoUsado = tiempoDisponible - reqBody.partida.tiempo_disponible;
                  const score = Math.round(tiempoUsado / tiempoDisponible) * 6 + 2;
                  // await knex.raw(
                  //   `UPDATE Partida
                  //   SET score = ${score}
                  //   WHERE id = ${reqBody.partida.id}`,
                  // );
                  await knex('partida')
                    .where('id', reqBody.partida.id)
                    .update({
                      score, // score: score
                    });
                  response.partida.score = score;
                  response.comentario.push(`Has obtenido un puntaje de ${score} puntos`);
                })
                .catch((err) => {
                  console.log(err);
                  response.estado = 'Error';
                  response.comentario.push('Error en body en <tiempo_restante>');
                });
            }
          });
      } else {
        // Imagenes no coinciden
        response.relacion_imagenes = 0;
        // const vidas = await knex.raw(
        //   `SELECT vidas FROM Partida
        //   WHERE id = ${reqBody.partida.id}`,
        // )
        await knex('partida')
          // .select('vidas')
          .where('id', reqBody.partida.id)
          .then(async (vidas) => {
            const newVida = vidas[0].vidas - 1;
            if (newVida <= 0) {
              // Perdio el juego
              response.comentario.push('Relación entre imagenes incorrecta');
              response.comentario.push('Perdiste el juego');
              response.comentario.push('¿Quieres guardar la partida?');
              response.partida.activa = 0;
              response.partida.vidas = newVida;
            } else {
              // Puede seguir jugando
              response.comentario.push('Relación entre imagenes incorrecta');
              response.comentario.push('Perdiste 1 vida');
              response.partida.vidas = newVida;
              // await knex.raw(
              //   `UPDATE Partida
              //   SET vidas = ${newVida}
              //   WHERE id = ${reqBody.partida.id}`,
              // )
              await knex('partida')
                .where('id', reqBody.partida.id)
                .update({
                  vidas: newVida,
                });
            }
          })
          .catch((err) => {
            response.estado = 'Error';
            response.comentario.push('Error en los datos de <Partida>');
            console.log(err);
          });
      }
    })
    .catch((err) => {
      response.estado = 'Error';
      response.comentario.push('Error en los datos');
      console.log(err);
    });

  console.log(reqBody)
  console.log(response)
  
  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

// -----------------------------------------------------

// =====================================================
//   Utilizacion de bonus
// =====================================================
router.post('/usebonus', async (ctx) => {
  const reqBody = ctx.request.body;

  const response = {
    comentario: [], // no es necesario para el funcionamiento
    imagenes: [],
    partida: {
      bonus: [],
    },
    tablero: {
      imagenes: [],
    },
    estado: 'ok',
  };

  // const resQuery = await knex.raw(
  //   `SELECT * FROM Partida_Bonus PB, Bonus B
  //   WHERE PB.id_partida = ${reqBody.partida.id}
  //   AND PB.id_bonus = ${reqBody.partida.bonus_a_usar}
  //   AND PB.usado = 0
  //   AND B.id = PB.id_bonus`,
  // )
  await knex('partida_bonus AS PB')
    .join('bonus AS B', 'B.id', 'PB.id_bonus')
    .where({
      'PB.id_partida': reqBody.partida.id,
      'PB.id_bonus': reqBody.partida.bonus_a_usar,
      'PB.usado': 0,
    })
    .then(async (resQuery) => {
      const bonus = resQuery[0];
      if (bonus) {
        // await knex.raw(
        //   `UPDATE Partida_Bonus
        //   SET usado = 1
        //   WHERE id_partida = ${reqBody.partida.id}
        //   AND id_bonus = ${reqBody.partida.bonus_a_usar}`,
        // )
        await knex('partida_bonus')
          .where({
            id_partida: reqBody.partida.id,
            id_bonus: reqBody.partida.bonus_a_usar,
          })
          .update({
            usado: 1,
          });
        // Actualizacion del estado de las imagenes
        // await knex.raw(
        //   `SELECT * FROM Tablero_Imagenes TI, Bonus B
        //   WHERE TI.id_tablero = ${reqBody.tablero.id}
        //   AND B.id = ${bonus.id}`,
        //   )
        await knex('tablero_imagenes AS TI')
          .join('bonus AS B', 'B.id', bonus.id)
          .where('TI.id_tablero', reqBody.tablero.id)
          .then(async (resQuery) => {
            const datosImagenes = resQuery;
            await Promise.all(
              // eslint-disable-next-line array-callback-return
              datosImagenes.map((dato) => {
                response.imagenes.push(
                  {
                    id: dato.id_imagen,
                    accion_temporal: dato.tipo,
                    descripsion_temporal: dato.descripcion,
                    duracion_de_bonus: dato.duracion,
                  },
                );
              }),
            );
          });
        switch (bonus.id) {
          case 1:
            // Bonus 1
            response.comentario.push(`${bonus.tipo}: ${bonus.descripcion}`);
            break;
          case 2:
            // Bonus 2
            response.comentario.push(`${bonus.tipo}: ${bonus.descripcion}`);
            break;
          default:
            // Bonus 3
            response.comentario.push(`${bonus.tipo}: ${bonus.descripcion}`);
        }
        // Envian los datos temporales de cambio de las imagenes
        // Actualiza los datos de bonus
        // await knex.raw(
        //   `SELECT * FROM Partida_Bonus PB, Bonus B
        //   WHERE PB.id_partida = ${reqBody.partida.id}
        //   AND B.id = PB.id_bonus`,
        //   )
        await knex('partida_bonus AS PB')
          .join('bonus AS B', 'B.id', 'PB.id_bonus')
          .where('PB.id_partida', reqBody.partida.id)
          .then(async (resQuery) => {
            response.comentario.push(`Se actualizó el estado "usado" del bonus ${reqBody.partida.bonus_a_usar}`);
            const bonus2 = resQuery;
            await Promise.all(
              bonus2.map((bon, index) => {
                response.partida.bonus[index] = {
                  id: bon.id,
                  tipo: bon.tipo,
                  descripsion: bon.descripsion,
                  usado: bon.usado,
                };
              }),
            );
          })
          .catch((err) => {
            console.log(err);
            response.estado = 'Error';
          });
      } else {
        // no hay bonus
        response.comentario.push('No puedes usar el bonus espesificado');
      }
    })
    .catch((err) => {
      console.log(err);
      response.estado = 'Error';
    });

  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

// -----------------------------------------------------

// =====================================================
//   Termino el tiempo
// =====================================================
router.post('/timeout', async (ctx) => {
  const reqBody = ctx.request.body;
  const response = {
    partida: {
      activa: undefined,
    },
    comentario: [],
    estado: 'ok',
  };
  // Revisión usuario correcto
  // await knex.raw(
  //   `SELECT * FROM Historial H
  //   WHERE H.id_usuario = ${reqBody.usuario.id}
  //   AND H.id_partida = ${reqBody.partida.id}`,
  //   )
  await knex('historial AS H')
    .where({
      'H.id_usuario': reqBody.usuario.id,
      'H.id_partida': reqBody.partida.id,
    })
    .then(async (resQuery) => {
      const partida = resQuery[0];
      if (partida) {
        // await knex.raw(
        //   `UPDATE Partida
        //   SET score = 0, tiempo_restante = 0
        //   WHERE id = ${reqBody.partida.id}`,
        // )
        await knex('partida')
          .where('id', reqBody.partida.id)
          .update({
            score: 0,
            tiempo_restante: 0,
          });
        response.comentario.push('Tiempo terminado');
        response.partida.activa = 0;
      } else {
        response.comentario.push('Error al terminar partida, usuario y partida no coinciden');
      }
    })
    .catch((err) => {
      console.log(err);
      response.estado = 'Error';
      response.comentario = 'Error en datos de <partida>';
    });

  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

module.exports = router;

// Opsiones del juego
//  1. (despues) guardar
//  2. (despues) Pausa -> agregar propiedad de imagen de bloquear
//    -> detener el tiempo

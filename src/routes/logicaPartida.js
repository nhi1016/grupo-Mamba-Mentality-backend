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
    },
    relacion_imagenes: undefined, // booleano {1 o 0}
    comentario: [], // no es necesario para el funcionamiento
  };

  const resQuery = await knex.raw(
    `SELECT RI.id_img2 AS id_img2 FROM R_Im_Im RI
        WHERE RI.id_img1 = ${reqBody.id_img1}`,
  );

  if (resQuery.rows[0].id_img2 === reqBody.id_img2) {
    // Las imágenes coinsiden
    response.relacion_imagenes = 1;
    response.partida.vidas = reqBody.partida.vidas;
    response.comentario.push('Relación entre imagenes correcta');
    await knex.raw(
      `UPDATE Tablero_Imagenes
      SET enlazada = 1
      WHERE id_tablero = ${}
      AND id_imagen = ${}`,
    );
  } else {
    // Imagenes no coinciden
    response.relacion_imagenes = 0;
    const vidas = await knex.raw(
      `SELECT vidas FROM Partida
      WHERE id = ${reqBody.partida.id}`,
    );
    const newVida = vidas.rows[0].vidas - 1;
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
      await knex.raw(
        `UPDATE Partida
        SET vidas = ${newVida}
        WHERE id = ${reqBody.partida.id}`,
      );
    }
  }

  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

// -----------------------------------------------------

module.exports = router;

// Termina el juego cuando:
//  1. Se enlazan todas las imagenes
//  2. Cuando se acaba el tiempo (despues)
// Falta logica para ocupar bonus (se pueden ocupar una sola vez)
//  1. Agregar propiedad de imagen visible o no y un tiempo de duración
//  2. Agregar propiedad de imagen transarente y un tiempo de duración
//  3. Agregar propiedad de comentario a la imagen y un tiempo de duración
// Bonus -> agregar tiempo de duración
// Opsiones del juego
//  1. guardar
//  2. Pausa -> agregar propiedad de imagen de bloquear
//    -> detener el tiempo
//  3. abandonar
//    -> borrar la partida default
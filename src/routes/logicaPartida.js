const Router = require('koa-router');
const knex = require('../controllers/knex');

const router = new Router();


// =====================================================
//   Enlace de imagenes
// =====================================================
router.post('/checkimages', async (ctx) => {
  const reqBody = ctx.request.body;

  const response = {
    relacion_imagenes: undefined, // booleano {1 o 0}
    vida: undefined,
    comentario: '', // no es necesario para el funcionamiento
  };

  const resQuery = await knex.raw(
    `SELECT RI.id_img2 AS id_img2 FROM R_Im_Im RI
        WHERE RI.id_img1 = ${reqBody.id_img1}`,
  );

  if (resQuery.rows[0].id_img2 === reqBody.id_img2) {
    response.relacion_imagenes = 1;
    response.comentario += 'Relación entre imagenes correcta; ';
  } else {
    response.relacion_imagenes = 0;
    response.comentario += 'Relación entre imagenes incorrecta; ';
  }

  ctx.body = response;
  ctx.status = 200;
});
// =====================================================
// =====================================================

// -----------------------------------------------------

module.exports = router;

require('dotenv').config();
const knex = require('../controllers/knex');

const seeds = [
  // Usuario
  `INSERT INTO Usuario(nickname, password) VALUES
  ('nikin', 4444),
  ('roki', 5543);`,
];

const crearSeed = () => {
  seeds.forEach((instruction) => {
    const nombreTabla = instruction.split(' ')[2].split('(')[0];
    knex.raw(instruction).then(() => {
      console.log(`Datos insertados en tabla: ${nombreTabla}`);
    }).catch((err) => {
      console.log(err);
      console.log(`No se pudo insertar datos en tabla: ${nombreTabla}`);
    });
  });
};

crearSeed();

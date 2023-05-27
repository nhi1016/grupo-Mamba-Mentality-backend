require('dotenv').config();
const knex = require('../controllers/knex');

const tablas = [
  'DROP TABLE Partida_Bonus',
  'DROP TABLE Bonus',
  'DROP TABLE R_Im_Im',
  'DROP TABLE Tablero_Imagenes',
  'DROP TABLE Imagen',
  'DROP TABLE Tablero_Partida',
  'DROP TABLE Tablero',
  'DROP TABLE Historial',
  'DROP TABLE Partida',
  'DROP TABLE Usuario',
];

const borrarTablas = () => {
  tablas.forEach(async (instruction) => {
    const nombreTabla = instruction.split(' ')[2];
    try {
      await knex.raw(instruction);
      console.log(`Tablas ${nombreTabla} borradas exitosamente`);
    } catch (err) {
      // console.log(err.stack);
      console.log(`¡¡ Error al borrar Tabla: ${nombreTabla} !!`);
    }
  });
};

borrarTablas();

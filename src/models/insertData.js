require('dotenv').config();
const knex = require('../controllers/knex');

const seeds = [
  // Usuario
  `INSERT INTO Usuario(nickname, password) VALUES
  ('nikin', 4444),
  ('roki', 5543);`,
  // Partida
  `INSERT INTO Partida(score, vidas, tiempo_restante) VALUES 
  (),
  ();`,
  // Historial
  `INSERT INTO Historial() VALUES 
  (),
  ();`,
  // Tablero
  `INSERT INTO Tablero() VALUES 
  (),
  ();`,
  // Tablero_Partida
  `INSERT INTO Tablero_Partida() VALUES 
  (),
  ();`,
  // Imagen
  `INSERT INTO Imagen() VALUES 
  (),
  ();`,
  // Tablero_Imagenes
  `INSERT INTO Tablero_Imagenes() VALUES 
  (),
  ();`,
  // R_Im_Im
  `INSERT INTO R_Im_Im() VALUES 
  (),
  ();`,
  // Bonus
  `INSERT INTO Bonus() VALUES 
  (),
  ();`,
  // Partida_Bonus
  `INSERT INTO Partida_Bonus() VALUES 
  (),
  ();`,
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

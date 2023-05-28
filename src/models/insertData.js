require('dotenv').config();
const knex = require('../controllers/knex');

const date = new Date();
const seeds = [
  // Usuario
  `INSERT INTO Usuario(id, nickname, password) VALUES
  (1, 'nikin', 4444),
  (2, 'roki', 5543);`,
  // Partida
  `INSERT INTO Partida(id, score, vidas, tiempo_restante) VALUES 
  (1, 7, 2, 10),
  (2, 4, 1, 20);`,
  // Historial
  `INSERT INTO Historial(id, id_usuario, id_partida, fecha) VALUES 
  (1, 1, 1, '${date.toISOString().replace('T', ' ').replace('Z', '')}'),
  (2, 2, 2, '${date.toISOString().replace('T', ' ').replace('Z', '')}');`,
  // Tablero
  `INSERT INTO Tablero(id, tamano, dificultad) VALUES 
  (1, 10, 'fasil'),
  (2, 20, 'dificil');`,
  // Tablero_Partida
  `INSERT INTO Tablero_Partida(id, id_partida, id_tablero) VALUES 
  (1, 1, 2),
  (2, 2, 1);`,
  // Imagen
  `INSERT INTO Imagen(id, nombre) VALUES 
  (1, '124.jpg'),
  (2, '123.jpg');`,
  // Tablero_Imagenes
  `INSERT INTO Tablero_Imagenes(id, id_tablero, id_imagen) VALUES 
  (1, 2, 1),
  (2, 1, 2);`,
  // R_Im_Im
  `INSERT INTO R_Im_Im(id, id_img1, id_img2) VALUES 
  (1, 1, 2);`,
  // Bonus
  `INSERT INTO Bonus(id, tipo, descripción) VALUES 
  (1, 'vista rápida', 'puedes ver las imagenes por 3 segundos'),
  (2, 'transparencia', 'las imagenes se tornan transparentes por 4 segundos');`,
  // Partida_Bonus
  `INSERT INTO Partida_Bonus(id, id_partida, id_bonus) VALUES 
  (1, 1, 1),
  (2, 1, 2),
  (3, 2, 1);`,
];

const crearSeed = () => {
  seeds.forEach((instruction) => {
    const nombreTabla = instruction.split(' ')[2].split('(')[0];
    knex.raw(instruction).then(() => {
      console.log(`- Datos insertados en tabla: ${nombreTabla}`);
    }).catch((err) => {
      console.log(`!! No se pudo insertar datos en tabla: ${nombreTabla}`);
      console.log(`${err}`);
    });
  });
};

crearSeed();

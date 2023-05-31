require('dotenv').config();
const knex = require('../controllers/knex');

const date = new Date();
const seeds = [
  // Usuario
  `INSERT INTO Usuario(id, nickname, password) VALUES
  (1, 'Robertin123', 1111),
  (2, 'nikin', 4444),
  (3, 'roki', 5543);`,
  // Partida
  `INSERT INTO Partida(id, score, vidas, tiempo_restante, titulo) VALUES 
  (1, 0, 4, 600, 'Default#Robertin123'),
  (2, 7, 2, 10, 'Default 2'),
  (3, 4, 1, 20, 'Default 3'),
  (4, 4, 1, 15, 'Default 4');`,
  // Historial
  `INSERT INTO Historial(id_usuario, id_partida, fecha) VALUES 
  (1, 1, '2000-01-01 00:00:00.000'),
  (2, 2, '${date.toISOString().replace('T', ' ').replace('Z', '')}'),
  (2, 4, '2023-03-01 00:00:00.000');`,
  // Tablero
  `INSERT INTO Tablero(tamano, dificultad) VALUES 
  (4, 'facil'),
  (4, 'medio'),
  (20, 'dificil');`,
  // Tablero_Partida
  `INSERT INTO Tablero_Partida(id_partida, id_tablero) VALUES 
  (1, 2),
  (2, 1);`,
  // Imagen
  `INSERT INTO Imagen(id, nombre, dificultad, ruta) VALUES 
  (1, '1.png', 'facil', '../models/images'),
  (2, '3.png', 'facil', '../models/images'),
  (3, '5.png', 'facil', '../models/images'),
  (4, '7.png', 'facil', '../models/images'),
  (5, '9.png', 'facil', '../models/images'),
  (6, '11.png', 'facil', '../models/images'),
  (7, '13.png', 'facil', '../models/images'),
  (8, '15.png', 'facil', '../models/images'),
  (9, '17.png', 'facil', '../models/images'),
  (10, '18.png', 'medio', '../models/images'),
  (11, '19.png', 'medio', '../models/images'),
  (12, '20.png', 'medio', '../models/images'),
  (13, '21.png', 'medio', '../models/images'),
  (14, '22.png', 'medio', '../models/images'),
  (15, '23.png', 'medio', '../models/images'),
  (16, '24.png', 'medio', '../models/images'),
  (17, '25.png', 'medio', '../models/images'),
  (18, '26.png', 'medio', '../models/images'),
  (19, '27.png', 'medio', '../models/images'),
  (20, '28.png', 'medio', '../models/images'),
  (21, '29.png', 'medio', '../models/images'),
  (22, '30.png', 'medio', '../models/images'),
  (23, '31.png', 'medio', '../models/images'),
  (24, '32.png', 'medio', '../models/images');`,
  // Tablero_Imagenes
  `INSERT INTO Tablero_Imagenes(id_tablero, id_imagen) VALUES 
  (2, 1),
  (1, 2);`,
  // R_Im_Im
  `INSERT INTO R_Im_Im(id, id_img1, id_img2) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 4),
  (5, 5, 5),
  (6, 6, 6),
  (7, 7, 7),
  (8, 8, 8),
  (9, 9, 10),
  (10, 10, 9),
  (11, 11, 12),
  (12, 12, 11),
  (13, 13, 14),
  (14, 14, 13),
  (15, 15, 16),
  (16, 16, 15),
  (17, 17, 18),
  (18, 18, 17),
  (19, 19, 20),
  (20, 20, 19),
  (21, 21, 22),
  (22, 22, 21),
  (23, 23, 24),
  (24, 24, 23);`,
  // Bonus
  `INSERT INTO Bonus(id, tipo, descripcion) VALUES 
  (1, 'vista rápida', 'puedes ver las imagenes por 3 segundos'),
  (2, 'transparencia', 'las imagenes se tornan transparentes por 4 segundos'),
  (3, 'pista', 'una pista de las posiciones del tablero relacionadas');`,
  // Partida_Bonus
  `INSERT INTO Partida_Bonus(id_partida, id_bonus) VALUES 
  (1, 1),
  (1, 2),
  (1, 3);`,
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
  console.log('\n', '--------------------------------------------------');
};

crearSeed();
setTimeout(() => {
  knex.destroy();
}, '1000')

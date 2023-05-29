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
  `INSERT INTO Partida(id, score, vidas, tiempo_restante) VALUES 
  (1, 0, 4, 600),
  (2, 7, 2, 10),
  (3, 4, 1, 20);`,
  // Historial
  `INSERT INTO Historial(id, id_usuario, id_partida, fecha) VALUES 
  (1, 1, 1, '2000-01-01 00:00:00.000'),
  (2, 2, 2, '${date.toISOString().replace('T', ' ').replace('Z', '')}');`,
  // Tablero
  `INSERT INTO Tablero(id, tamano, dificultad) VALUES 
  (1, 4, 'fácil'),
  (2, 4, 'medio'),
  (3, 20, 'difícil');`,
  // Tablero_Partida
  `INSERT INTO Tablero_Partida(id, id_partida, id_tablero) VALUES 
  (1, 1, 2),
  (2, 2, 1);`,
  // Imagen
  `INSERT INTO Imagen(id, nombre) VALUES 
  (1, '1.jpg'),
  (2, '2.jpg'),
  (3, '3.jpg'),
  (4, '4.jpg'),
  (5, '5.jpg'),
  (6, '6.jpg'),
  (7, '7.jpg'),
  (8, '8.jpg'),
  (9, '9.jpg'),
  (10, '10.jpg'),
  (11, '11.jpg'),
  (12, '12.jpg'),
  (13, '13.jpg'),
  (14, '14.jpg'),
  (15, '15.jpg'),
  (16, '16.jpg'),
  (17, '17.jpg'),
  (18, '18.jpg'),
  (19, '19.jpg'),
  (20, '20.jpg'),
  (21, '21.jpg'),
  (22, '22.jpg'),
  (23, '23.jpg'),
  (24, '24.jpg'),
  (25, '25.jpg'),
  (26, '26.jpg'),
  (27, '27.jpg'),
  (28, '28.jpg'),
  (29, '29.jpg'),
  (30, '30.jpg'),
  (31, '31.jpg'),
  (32, '32.jpg');`,
  // Tablero_Imagenes
  `INSERT INTO Tablero_Imagenes(id, id_tablero, id_imagen) VALUES 
  (1, 2, 1),
  (2, 1, 2);`,
  // R_Im_Im
  `INSERT INTO R_Im_Im(id, id_img1, id_img2) VALUES
  (1, 1, 2),
  (2, 2, 1),
  (3, 3, 4),
  (4, 4, 3),
  (5, 5, 6),
  (6, 6, 5),
  (7, 7, 8),
  (8, 8, 7),
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
  (24, 24, 23),
  (25, 25, 26),
  (26, 26, 25),
  (27, 27, 28),
  (28, 28, 27),
  (29, 29, 30),
  (30, 30, 29),
  (31, 31, 32),
  (32, 32, 31);`,
  // Bonus
  `INSERT INTO Bonus(id, tipo, descripcion) VALUES 
  (1, 'vista rápida', 'puedes ver las imagenes por 3 segundos'),
  (2, 'transparencia', 'las imagenes se tornan transparentes por 4 segundos'),
  (3, 'pista', 'una pista de las posiciones del tablero relacionadas');`,
  // Partida_Bonus
  `INSERT INTO Partida_Bonus(id, id_partida, id_bonus) VALUES 
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3);`,
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

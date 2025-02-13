require('dotenv').config();
const knex = require('../controllers/knex');

const tablas = [
  'CREATE TABLE Usuario(id SERIAL PRIMARY KEY, nickname VARCHAR(30) UNIQUE NOT NULL, password VARCHAR(90));',
  "CREATE TABLE Partida(id SERIAL PRIMARY KEY, score INT DEFAULT 0, vidas INT DEFAULT 4, tiempo_restante INT DEFAULT 600, titulo VARCHAR(30) DEFAULT 'Nueva Partida' );",
  'CREATE TABLE Historial(id SERIAL PRIMARY KEY, id_usuario INT, id_partida INT, fecha TIMESTAMP, FOREIGN KEY(id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE, FOREIGN KEY(id_partida) REFERENCES Partida(id) ON DELETE CASCADE);',
  'CREATE TABLE Tablero(id SERIAL PRIMARY KEY, tamano INT NOT NULL, dificultad VARCHAR(30) );',
  'CREATE TABLE Tablero_Partida(id SERIAL PRIMARY KEY, id_partida INT, id_tablero INT, FOREIGN KEY(id_partida) REFERENCES Partida(id) ON DELETE CASCADE, FOREIGN KEY(id_tablero) REFERENCES Tablero(id) ON DELETE CASCADE );',
  'CREATE TABLE Imagen(id SERIAL PRIMARY KEY, nombre VARCHAR(30) UNIQUE NOT NULL, dificultad VARCHAR(30), ruta VARCHAR(30) );',
  "CREATE TABLE Tablero_Imagenes(id SERIAL PRIMARY KEY, id_tablero INT NOT NULL, id_imagen INT NOT NULL, posicion INT, visible INT DEFAULT 0, enlazada INT DEFAULT 0, descripsion VARCHAR(60) DEFAULT '', bloqueada INT DEFAULT 0, FOREIGN KEY(id_tablero) REFERENCES Tablero(id) ON DELETE CASCADE, FOREIGN KEY(id_imagen) REFERENCES Imagen(id));",
  'CREATE TABLE R_Im_Im(id SERIAL PRIMARY KEY, id_img1 INT NOT NULL, id_img2 INT NOT NULL, FOREIGN KEY(id_img1) REFERENCES Imagen(id), FOREIGN KEY(id_img2) REFERENCES Imagen(id) );',
  'CREATE TABLE Bonus(id SERIAL PRIMARY KEY, tipo VARCHAR(30), duracion INT, descripcion VARCHAR(90) );',
  'CREATE TABLE Partida_Bonus(id SERIAL PRIMARY KEY, id_partida INT NOT NULL, id_bonus INT NOT NULL, usado INT DEFAULT 0, FOREIGN KEY(id_partida) REFERENCES Partida(id) ON DELETE CASCADE, FOREIGN KEY(id_bonus) REFERENCES Bonus(id) );',
];
// crear la propiedad "activa" en Partida, para consultar si la partida
// está activa o no en el endpoint checkimages

const crearTablas = () => {
  tablas.forEach(async (instruction) => {
    const nombreTabla = instruction.split(' ')[2].slice(0, -3);
    try {
      await knex.raw(instruction);
      console.log(`- Tabla: ${nombreTabla} creada exitosamente !!`);
    } catch (err) {
      console.log(err.stack);
      console.log(`¡¡ Error al crear Tabla: ${nombreTabla} !!`);
    }
  });
  console.log('\n', '--------------------------------------------------');
};

crearTablas();
setTimeout(() => {
  knex.destroy();
}, '1000');

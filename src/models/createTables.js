require('dotenv').config();
const knex = require('../controllers/knex');

const tablas = [
  'CREATE TABLE Usuario(id SERIAL PRIMARY KEY, nickname VARCHAR(30) UNIQUE NOT NULL, password VARCHAR(90));',
  'CREATE TABLE Partida(id SERIAL PRIMARY KEY, score INT DEFAULT 0, vidas INT DEFAULT 3, tiempo_restante INT DEFAULT 60);',
  'CREATE TABLE Historial(id SERIAL PRIMARY KEY, id_usuario INT, id_partida INT, fecha TIMESTAMP, FOREIGN KEY(id_usuario) REFERENCES Usuario(id), FOREIGN KEY(id_partida) REFERENCES Partida(id));',
  'CREATE TABLE Tablero(id SERIAL PRIMARY KEY, tamano INT NOT NULL, dificultad VARCHAR(30) );',
  'CREATE TABLE Tablero_Partida(id SERIAL PRIMARY KEY, id_partida INT, id_tablero INT, FOREIGN KEY(id_partida) REFERENCES Partida(id), FOREIGN KEY(id_tablero) REFERENCES Tablero(id) );',
  'CREATE TABLE Imagen(id SERIAL PRIMARY KEY, nombre VARCHAR(30) UNIQUE NOT NULL, dificultad VARCHAR(30) );',
  'CREATE TABLE Tablero_Imagenes(id SERIAL PRIMARY KEY, id_tablero INT NOT NULL, id_imagen INT NOT NULL, FOREIGN KEY(id_tablero) REFERENCES Tablero(id), FOREIGN KEY(id_imagen) REFERENCES Imagen(id));',
  'CREATE TABLE R_Im_Im(id SERIAL PRIMARY KEY, id_img1 INT NOT NULL, id_img2 INT NOT NULL, FOREIGN KEY(id_img1) REFERENCES Imagen(id), FOREIGN KEY(id_img2) REFERENCES Imagen(id) );',
  'CREATE TABLE Bonus(id SERIAL PRIMARY KEY, tipo VARCHAR(30), descripción VARCHAR(60) );',
  'CREATE TABLE Partida_Bonus(id SERIAL PRIMARY KEY, id_partida INT NOT NULL, id_bonus INT NOT NULL, FOREIGN KEY(id_partida) REFERENCES Partida(id), FOREIGN KEY(id_bonus) REFERENCES Bonus(id) );',
];

const crearTablas = () => {
  tablas.forEach(async (instruction) => {
    const nombreTabla = instruction.split(' ')[2].slice(0, -3);
    try {
      await knex.raw(instruction);
      console.log(`- Tabla: ${nombreTabla} creada exitosamente !!`);
    } catch (err) {
    //   console.log(err.stack);
      console.log(`¡¡ Error al crear Tabla: ${nombreTabla} !!`);
    }
  });
};

crearTablas();

const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const tabla1 = `CREATE TABLE Usuario(
                    id 			SERIAL PRIMARY KEY, 
					nikname 	VARCHAR(30) UNIQUE NOT NULL,
					password 	VARCHAR(90)
				)`;
const tabla2 = `CREATE TABLE Partida(
					id 				SERIAL PRIMARY KEY,
					score 			INT DEFAUL 0,
					vidas			INT DEFAULT 3,
					tiempo_restante	INT DEFAULT 60,
				)`;
const tabla3 = `CREATE TABLE Historial(
					id SERIAL 	PRIMARY KEY,
					id_usuario 	INT,
					id_partida 	INT,
					fecha DATETIME,
					FOREIGN KEY(id_usuario) REFERENCES Usuario(id),
					FOREIGN KEY(id_partida) REFERENCES Partida(id)
				)`;
const tabla4 = 'CREATE TABLE Ruta(id SERIAL PRIMARY KEY,nombre VARCHAR(30) UNIQUE NOT NULL)';
const tabla5 = 'CREATE TABLE Casilla(id SERIAL PRIMARY KEY,nombre VARCHAR(30) UNIQUE NOT NULL)';
const tabla6 = 'CREATE TABLE RutaCasillas(id SERIAL PRIMARY KEY,nombre_ruta VARCHAR(30) ,nombre_casilla VARCHAR(30) ,posicion INT)';
const tabla7 = 'CREATE TABLE Equipo(id SERIAL PRIMARY KEY,vida INT DEFAULT 100,suerte INT DEFAULT 10,nombre VARCHAR(30),etica INT DEFAULT 10,id_usuario INT,id_tablero INT,turno INT,id_ruta INT,id_casilla INT,FOREIGN KEY(id_usuario) REFERENCES Usuario(id),FOREIGN KEY(id_tablero) REFERENCES Tablero(id) ON DELETE CASCADE,FOREIGN KEY(id_ruta) REFERENCES Ruta(id),FOREIGN KEY(id_casilla) REFERENCES Casilla(id))';
const tabla8 = 'CREATE TABLE EquipoPersonaje(id SERIAL PRIMARY KEY,id_equipo INT,id_personaje INT,FOREIGN KEY(id_equipo) REFERENCES Equipo(id),FOREIGN KEY(id_personaje) REFERENCES Personaje(id))';

const tabla10 = 'CREATE TABLE Session(id SERIAL PRIMARY KEY,user_id INT REFERENCES "Users"(id))';

const crearTablas = async () => {
  try {
    await client.connect();
    await client.query(tabla6);
    console.log('Tablas RutaCasillas creadas exitosamente !!');
    await client.query(tabla10);
    console.log('Tablas Session creadas exitosamente !!');

    await client.end();
    console.log('Tablas creadas exitosamente !!');
  } catch (err) {
    console.log(err.stack);
    console.log('Error al crear las tablas !!');
    await client.end();
  }
};

// Abilitar esto para que funcione
// crearTablas();
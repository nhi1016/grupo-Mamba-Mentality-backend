const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const tablas = [
  'DROP TABLE Usuario',
  'DROP TABLE Partida',
  'DROP TABLE Historial',
  'DROP TABLE Tablero',
  'DROP TABLE Tablero_Partida',
  'DROP TABLE Imagen',
  'DROP TABLE Tablero_Imagenes',
  'DROP TABLE R_Im_Im',
  'DROP TABLE Bonus',
  'DROP TABLE Partida_Bonus',
];

const borrarTablas = () => {
  tablas.forEach(async (instruccion) => {
    const nombreTabla = instruction.split(' ')[2];
    try {
      await client.connect();
      await client.query(nombreTabla);
    		console.log(`Tablas ${nombreTabla} borradas exitosamente`);

      await client.end();
    } catch (err) {
      console.log(err.stack);
      console.log(`¡¡ Error al borrar Tabla: ${nombreTabla} !!`);
      await client.end();
    }
  });
};

// Abilitar esto para que funcione
borrarTablas();

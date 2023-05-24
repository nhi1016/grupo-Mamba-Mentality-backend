const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const tabla1 = 'DROP TABLE Usuario';
const tabla2 = 'DROP TABLE Tablero';
const tabla3 = 'DROP TABLE Personaje';
const tabla4 = 'DROP TABLE Ruta';
const tabla5 = 'DROP TABLE Casilla';
const tabla6 = 'DROP TABLE RutaCasillas';
const tabla7 = 'DROP TABLE Equipo';
const tabla8 = 'DROP TABLE EquipoPersonaje';
const tabla9 = 'DROP TABLE Session';

const borrarTablas = async () => {
  try {
    await client.connect();

    await client.query(tabla8);
    console.log('Tablas EquipoPersonaje borradas exitosamente');
    await client.query(tabla7);
    console.log('Tablas Equipo borradas exitosamente');
    await client.query(tabla6);
    console.log('Tablas RutaCasilla borradas exitosamente');
    await client.query(tabla5);
    console.log('Tablas Casilla borradas exitosamente');
    await client.query(tabla4);
    console.log('Tablas Ruta borradas exitosamente');
    await client.query(tabla3);
    console.log('Tablas Personaje borradas exitosamente');
    await client.query(tabla2);
    console.log('Tablas Tablero borradas exitosamente');
    await client.query(tabla9);
    console.log('Tablas Session borradas exitosamente');
    await client.query(tabla1);
    console.log('Tablas Usuario borradas exitosamente');

    await client.end();
    console.log('Tablas borradas exitosamente !!');
  } catch (err) {
    console.log(err.stack);
    console.log('Error al borrar las tablas !!');
    await client.end();
  }
};

// Abilitar esto para que funcione
// borrarTablas();
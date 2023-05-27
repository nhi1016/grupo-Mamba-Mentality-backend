const dotenv = require('dotenv');
const { Client } = require('pg');
// const bcrypt = require('bcrypt');

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* (async () => {
  const pass1 = await bcrypt.hash('constrasena 1', 6);
  const pass2 = await bcrypt.hash('constrasena 2', 6);
  const pass3 = await bcrypt.hash('constrasena 3', 6);
  console.log(pass1.length + 1)
})(); */

const seeds = [
  // Usuarios
  {
    values: [
      '$2b$06$B9R4PZga3tjqFolzA4NxZ.WUtPT00w/95IBhrLU6anyzsPqQyKurO',
      '$2b$06$8AtnVtFV6qTz9yar5C7gQONQkQpPzmpO.RydeUkUnhk3jS9b5atmS',
      '$2b$06$btyZIYeAxDLmMDcO7ys3qusmIBS8h9088MZVXYPj5c0IpzA9zd4Mm',
    ],
    query: "INSERT INTO Usuario(nombre, email, password) VALUES \
            ('Roberto', 'roto@gm.co', $1),\
            ('Rodrigo', 'rodi@gm.co', $2),\
            ('Ricardo', 'rico@gm.co', $3)",
  },
  // Tablero
  {
    values: [], query: "INSERT INTO Tablero(nombre , id_usuario) VALUES \
                        ('Tablero 1', 1), \
                        ('Tablero 2', 2)",
  },
  // Personaje
  {
    values: [], query: "INSERT INTO Personaje(avatar, habilidad) VALUES \
                        ('healer', 'correr'),\
                        ('tank', 'disparar'),\
                        ('hacker', 'mentir'),\
                        ('fighter', 'llegar primero')",
  },
  // Ruta
  {
    values: [], query: "INSERT INTO Ruta(nombre) VALUES \
                        ('Jugador 1'),\
                        ('Jugador 2'),\
                        ('Jugador 3'),\
                        ('Jugador 4'),\
                        ('Jugador 5'),\
                        ('Jugador 6')",
  },
  // Casilla
  {
    values: [], query: "INSERT INTO Casilla(nombre) VALUES \
                        ('J1-0'),('J1-1'),('J1-2'),('J1-3'),('J1-4'),('J1-5'),('J1-6'),('J1-7'),('J1-8'),('J1-9'),\
                        ('J2-0'),('J2-1'),('J2-2'),('J2-3'),('J2-4'),('J2-5'),('J2-6'),('J2-7'),('J2-8'),('J2-9'),\
                        ('J3-0'),('J3-1'),('J3-2'),('J3-3'),('J3-4'),('J3-5'),('J3-6'),('J3-7'),('J3-8'),('J3-9'),\
                        ('J4-0'),('J4-1'),('J4-2'),('J4-3'),('J4-4'),('J4-5'),('J4-6'),('J4-7'),('J4-8'),('J4-9'),\
                        ('J5-0'),('J5-1'),('J5-2'),('J5-3'),('J5-4'),('J5-5'),('J5-6'),('J5-7'),('J5-8'),('J5-9'),\
                        ('J6-0'),('J6-1'),('J6-2'),('J6-3'),('J6-4'),('J6-5'),('J6-6'),('J6-7'),('J6-8'),('J6-9'),\
                        ('C1'),('C2'),('C3'),('C4'),('C5'),('C6'),('C7'),('C8'),('C9'),('C10'),('C11'),('C12'),('C13'),('C14'),('C15'),('C16'),('C17'),('C18'),('C19')",
  },
  // RutaCasillas **está solo creada para el jugador 1**
  {
    values: [], query: "INSERT INTO RutaCasillas(nombre_ruta,nombre_casilla,posicion) VALUES \
                        ('Jugador 1','J1-0',0),('Jugador 1','J1-1',1),('Jugador 1','J1-2',2),('Jugador 1','J1-3',3),('Jugador 1','J1-4',4),\
                        ('Jugador 1','J1-5',5),('Jugador 1','J1-6',6),('Jugador 1','J1-7',7),('Jugador 1','J1-8',8),('Jugador 1','J1-9',9),\
                        ('Jugador 1','C3',10),('Jugador 1','C4',11),('Jugador 1','C5',12),('Jugador 1','C6',13),('Jugador 1','C7',14),\
                        ('Jugador 1','C8',15),('Jugador 1','C9',16),('Jugador 1','C10',17),('Jugador 1','C11',18),('Jugador 1','C12',19),\
                        ('Jugador 1','C1',20),('Jugador 1','C2',21),('Jugador 1','C14',22),('Jugador 1','C15',23),('Jugador 1','C16',24),\
                        ('Jugador 1','C17',25),('Jugador 1','C18',26),('Jugador 1','C13',27),('Jugador 1','C19',28),\
                        ('Jugador 2','J2-0',0),('Jugador 2','J2-1',1),('Jugador 2','J2-2',2),('Jugador 2','J2-3',3),('Jugador 2','J2-4',4),\
                        ('Jugador 2','J2-5',5),('Jugador 2','J2-6',6),('Jugador 2','J2-7',7),('Jugador 2','J2-8',8),('Jugador 2','J2-9',9),\
                        ('Jugador 2','C5',10),('Jugador 2','C6',11),('Jugador 2','C7',12),('Jugador 2','C8',13),('Jugador 2','C9',14),\
                        ('Jugador 2','C10',15),('Jugador 2','C11',16),('Jugador 2','C12',17),('Jugador 2','C1',18),('Jugador 2','C2',19),\
                        ('Jugador 2','C3',20),('Jugador 2','C4',21),('Jugador 2','C15',22),('Jugador 2','C16',23),('Jugador 2','C17',24),\
                        ('Jugador 2','C18',25),('Jugador 2','C13',26),('Jugador 2','C14',27),('Jugador 2','C19',28),\
                        ('Jugador 3','J3-0',0),('Jugador 3','J3-1',1),('Jugador 3','J3-2',2),('Jugador 3','J3-3',3),('Jugador 3','J3-4',4),\
                        ('Jugador 3','J3-5',5),('Jugador 3','J3-6',6),('Jugador 3','J3-7',7),('Jugador 3','J3-8',8),('Jugador 3','J3-9',9),\
                        ('Jugador 3','C7',10),('Jugador 3','C8',11),('Jugador 3','C9',12),('Jugador 3','C10',13),('Jugador 3','C11',14),\
                        ('Jugador 3','C12',15),('Jugador 3','C1',16),('Jugador 3','C2',17),('Jugador 3','C3',18),('Jugador 3','C4',19),\
                        ('Jugador 3','C5',20),('Jugador 3','C6',21),('Jugador 3','C16',22),('Jugador 3','C17',23),('Jugador 3','C18',24),\
                        ('Jugador 3','C13',25),('Jugador 3','C14',26),('Jugador 3','C15',27),('Jugador 3','C19',28),\
                        ('Jugador 4','J4-0',0),('Jugador 4','J4-1',1),('Jugador 4','J4-2',2),('Jugador 4','J4-3',3),('Jugador 4','J4-4',4),\
                        ('Jugador 4','J4-5',5),('Jugador 4','J4-6',6),('Jugador 4','J4-7',7),('Jugador 4','J4-8',8),('Jugador 4','J4-9',9),\
                        ('Jugador 4','C9',10),('Jugador 4','C10',11),('Jugador 4','C11',12),('Jugador 4','C12',13),('Jugador 4','C1',14),\
                        ('Jugador 4','C2',15),('Jugador 4','C3',16),('Jugador 4','C4',17),('Jugador 4','C5',18),('Jugador 4','C6',19),\
                        ('Jugador 4','C7',20),('Jugador 4','C8',21),('Jugador 4','C17',22),('Jugador 4','C18',23),('Jugador 4','C13',24),\
                        ('Jugador 4','C14',25),('Jugador 4','C15',26),('Jugador 4','C16',27),('Jugador 4','C19',28),\
                        ('Jugador 5','J5-0',0),('Jugador 5','J5-1',1),('Jugador 5','J5-2',2),('Jugador 5','J5-3',3),('Jugador 5','J5-4',4),\
                        ('Jugador 5','J5-5',5),('Jugador 5','J5-6',6),('Jugador 5','J5-7',7),('Jugador 5','J5-8',8),('Jugador 5','J5-9',9),\
                        ('Jugador 5','C11',10),('Jugador 5','C12',11),('Jugador 5','C1',12),('Jugador 5','C2',13),('Jugador 5','C3',14),\
                        ('Jugador 5','C4',15),('Jugador 5','C5',16),('Jugador 5','C6',17),('Jugador 5','C7',18),('Jugador 5','C8',19),\
                        ('Jugador 5','C9',20),('Jugador 5','C10',21),('Jugador 5','C18',22),('Jugador 5','C13',23),('Jugador 5','C14',24),\
                        ('Jugador 5','C15',25),('Jugador 5','C16',26),('Jugador 5','C17',27),('Jugador 5','C19',28),\
                        ('Jugador 6','J6-0',0),('Jugador 6','J6-1',1),('Jugador 6','J6-2',2),('Jugador 6','J6-3',3),('Jugador 6','J6-4',4),\
                        ('Jugador 6','J6-5',5),('Jugador 6','J6-6',6),('Jugador 6','J6-7',7),('Jugador 6','J6-8',8),('Jugador 6','J6-9',9),\
                        ('Jugador 6','C1',10),('Jugador 6','C2',11),('Jugador 6','C3',12),('Jugador 6','C4',13),('Jugador 6','C5',14),\
                        ('Jugador 6','C6',15),('Jugador 6','C7',16),('Jugador 6','C8',17),('Jugador 6','C9',18),('Jugador 6','C10',19),\
                        ('Jugador 6','C11',20),('Jugador 6','C12',21),('Jugador 6','C13',22),('Jugador 6','C14',23),('Jugador 6','C15',24),\
                        ('Jugador 6','C16',25),('Jugador 6','C17',26),('Jugador 6','C18',27),('Jugador 6','C19',28)",
  },
  // Equipo
  {
    values: [], query: "INSERT INTO Equipo(nombre,id_usuario,id_tablero,turno,id_ruta,id_casilla) VALUES \
                        ('Equipo ninja',1,1,1,1,1),\
                        ('Escuadrón Lobo',2,1,2,2,11)",
  },
  // EquipoPersonaje
  {
    values: [], query: 'INSERT INTO EquipoPersonaje(id_equipo,id_personaje) VALUES \
                        (1, 1),\
                        (2, 3)',
  },
];

const crearSeed = async () => {
  try {
    await client.connect();

    /* seeds.forEach(async (consulta) => {
      await console.log(`${consulta.values} - ${00}`);
      await client.query(consulta.query, consulta.values);
    }); */
    await client.query(seeds[5].query);
    console.log('Semilla 5 incertadas exitosamente !!');
  } catch (err) {
    console.log(err.stack);
    console.log('Error al insertar las semillas !!');
    await client.end();
  }
};

// Abilitar esto para que funcione
// crearSeed();

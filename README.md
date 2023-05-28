# grupo-Mamba-Mentality-backend

## Para instalar el proyecto se debe ejecutar
```console
yarn install
```
, por lo que se debe tener instalado `node` y ``yarn`` previamente

El cual instalará los siguientes paquetes:
+ `dotenv`
+ `koa`
+ `koa-body`
+ `koa-cors2`
+ `koa-logger`
+ `koa-router`
+ `nodemon`
+ `eslint`
+ `bcrypt`
+ `Knex`
+ `pg`

# Instrucciones para levantar el servidos
1. Definir la variable de entorno `PORT` en el archivo `.env`, por ejemplot (`PORT=3000`)

# Instrucciones para levantar la Base de Datos
1. Es necesario crear las variables de entorno en el archivo `.env` en el directorio `/`
2. Tener instalado `postgres`
2. Se deben definir las variables `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_USER` en el archivo `.env`
3. Crear la Base de Datos de:
    + Nombre = ``DB_NAME``
    + Usuario de postgres = ``DB_USER``
    + Password de usuario = `DB_PASSWORD`
    + `DB_HOST` = `localhost`
    + Se puede seguir el siguiente orden
    ```console
    sudo service postgresql start
    sudo -u postgres psql

    %% Dentro de la consola de postgres

    CREATE USER DB_USER WITH PASSWORD DB_PASSWORD;
    ALTER USER DB_USER WITH SUPERUSER;
    CREATE DATABASE DB_NAME WITH OWNER DB_USER;
    ```
4. Con el comando ``yarn migrar_db`` se crea la DB necearia
5. Con el comando ``yarn seed_db`` se incertan datos para testear la DB
6. Con el comando ``desmigrar_db`` se borran las tablas de la DB
\* Notar que despues de migrar y desmigrar la conexión con la DB queda habierta durante unos 60 segundos aproximadamente. Para terminar esa espera con `ctrl-c` termina sin causar problemas.

## Consultas a la DDBB
Para otorgar seguridad al proyecto de `SQL injections` se desidió utilizar `Knex.js` como query builder en vez de un ORM como `Sequelize`, ya que nos permite modelar la DDBB y las relaciones a nuestro gusto, además que el lenguaje de consulta es más intuitivo y parecido a ``SQL`` en consola

# La Base de Datos
Esta consiste en 5 entidades y 5 relaciones, las que se muestran como tablas a continuación:
1. Usuario
2. Partida
3. Historial
4. Tablero
5. Tablero_Partida
6. Imagen
7. Tablero_Imagenes
8. R_Im_Im
9. Bonus
10. Partida_Bonus

> Incertar imagen

# End-Point's
+ ``nombre`` - ``método http```- ``ruta`` - ``argumentos + formato`` - ``retorno + formato`` 
+ En la ventana inicio, cuando se apreta el boton jugar y no ha iniciado sesión se envía
`metodo http`: ``POST``
`ruta`: Game/FreeTrial
``argumentos y formato``:
{
    nickname: 'Robertin123'
}
``retorno y formato``:
{
	"usuario": {
		"nickname": "Robertin123",
		"vidas": 4
	},
	"tablero": {
		"tiempo_restante": 600,
		"tamano": 4,
		"imagenes": [],
		"bonus": [
			{
				"tipo": "vista rápida",
				"descripsion": "puedes ver las imagenes por 3 segundos"
			},
			{
				"tipo": "transparencia",
				"descripsion": "las imagenes se tornan transparentes por 4 segundos"
			},
			{
				"tipo": "pista",
				"descripsion": "una pista de las posiciones del tablero relacionadas"
			}
		]
	}
}
+ En la ventana inicio, cuando se apreta el boton jugar y si ha iniciado sesión se envía
/Game/nickname
{
    nickname: 'nickname'
}
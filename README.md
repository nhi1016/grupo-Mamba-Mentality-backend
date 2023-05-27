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

# Instrucciones para levantar la Base de Datos
1. Es necesario crear las variables de entorno en el archivo `.env` en el directorio `/`
2. Se deben definir las variables `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_USER` en el archivo `.env`
3. Con el comando ``yarn migrar_db`` se crea la DB necearia
4. Con el comando ``yarn seed_db`` se incertan datos para testear la DB
5. Con el comando ``desmigrar_db`` se borran las tablas de la DB
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
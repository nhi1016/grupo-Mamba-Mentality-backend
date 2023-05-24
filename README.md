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

# Instrucciones para levantar la Base de Datos
1. Con el comando ``yarn migrar_db`` se crea la DB necearia
2. Con el comando ``yarn seed_db`` se incertan datos para testear la DB
3. Con el comando ``desmigrar_db`` se borran las tablas de la DB

# End-Point's
+ ``nombre`` - ``método http```- ``ruta`` - ``argumentos + formato`` - ``retorno + formato`` 
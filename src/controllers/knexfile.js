require('dotenv').config();

module.exports = {
  dev2: {
    client: 'pg',
    connection: process.env.DB_CONECTION_STRING,
    pool: { min: 0, max: 1 },
    acquireConnectionTimeout: 1000,
  },
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 1 },
    acquireConnectionTimeout: 1000,
  },
};

import dbKnex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

dbKnex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 2 },
});

export default dbKnex;

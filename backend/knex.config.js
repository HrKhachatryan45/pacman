require('dotenv').config();

module.exports = {
  development: {
    client: 'pg', // Use 'pg' for PostgreSQL
    connection: {
      host: process.env.PSQL_HOST,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PASSWORD,
      database: process.env.PSQL_DATABASE,
      port: process.env.PSQL_PORT , // Default PostgreSQL port
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  production: {
    client: 'pg', // Use 'pg' for PostgreSQL
    connection: {
      host: process.env.PSQL_HOST,
      user: process.env.PSQL_USER,
      password: process.env.PSQL_PASSWORD,
      database: process.env.PSQL_DATABASE,
      port: process.env.PSQL_PORT , // Default PostgreSQL port
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

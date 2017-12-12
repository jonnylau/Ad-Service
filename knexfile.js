module.exports = {
  development: {
    client: 'pg', 
    connection: {
      hostname: 'postgres',
      host: 'localhost',
      port: '5432', //needed
      user: 'postgres',
      password: '',
      database: 'youtube',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }
};
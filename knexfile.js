module.exports = {
  development: {
    client: 'pg', 
    connection: {
      hostname: 'postgres',
      host: 'localhost',
      port: '5432',
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
    connection: 'postgres://postgres@172.17.03',
    migrations: {
      directory: __dirname + '/db/migrations',
    }
  }
};

// "IPv4Address": "172.17.0.3/16"
// process.env.DATABASE_URL
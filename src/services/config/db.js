const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'Admin0root',
        database: 'db_teste_knex'
    }
});

module.exports = knex;
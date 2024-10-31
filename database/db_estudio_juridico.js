const { Pool } = require('pg');

const conexion = new Pool({
    // user: 'postgres',
    // host: 'localhost',
    // database: 'db_estudio_juridico',
    // password: '31317933',
    // port: 5432,

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
});

module.exports = conexion;
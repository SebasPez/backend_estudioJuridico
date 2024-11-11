const { Pool } = require('pg');

const conexion = new Pool({    
    connectionString: process.env.DB_DATABASE,
    ssl: process.env.MODO === 'produccion'
});

module.exports = conexion;
const { Pool } = require('pg');

const conexion = new Pool({    
    connectionString: process.env.DB_DATABASE,
    ssl:true
});
module.exports = conexion;
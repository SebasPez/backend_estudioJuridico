const { Pool } = require('pg');

const conexion = new Pool({
    user: 'postgres',          // Usuario de la base de datos
    host: 'localhost',          // Host (generalmente localhost)
    database: 'db_estudio_juridico',  // Nombre de la base de datos
    password: '31317933',  // Contraseña del usuario
    port: 5432,                 // Puerto de PostgreSQL (por defecto 5432)
});

module.exports = conexion;
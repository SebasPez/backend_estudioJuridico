const { Pool } = require('pg');

const conexion = new Pool({
    // user: 'postgres',
    // host: 'localhost',
    // database: 'db_estudio_juridico',
    // password: '31317933',
    // port: 5432,

    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_DATABASE,
    // password: process.env.DB_PASS,
    // port: 5432,
    connectionString: process.env.DB_DATABASE,
    ssl:true
});

// Función para probar la conexión
async function testConnection() {
    try {
        const res = await conexion.query('SELECT 1');
        console.log('Conexión exitosa a la base de datos:', res.rows);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
}

// Llama a la función de prueba
testConnection();

module.exports = conexion;
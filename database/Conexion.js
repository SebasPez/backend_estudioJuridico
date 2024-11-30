const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const conexion = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.MODO === 'produccion'
});

// Función para crear roles por defecto
const initializeDefaultRoles = async () => {
    const roles = ['admin', 'default'];

    try {
        for (let role of roles) {
            // Verificar si el rol ya existe
            const result = await conexion.query("SELECT * FROM rol WHERE tipo_rol = $1", [role]);

            if (result.rows.length === 0) {             
                await conexion.query("INSERT INTO rol (tipo_rol) VALUES ($1)", [role]);
               
            } else {
                console.log(`El rol ${role} ya existe.`);
            }
        }
    } catch (error) {
        console.error("Error al inicializar los roles por defecto:", error.message);
    }
};


// Función para crear el usuario por defecto
const initializeDefaultUser = async () => {
    const defaultUsername = "admin";
    const defaultPassword = "admin";

    try {
        // Verificar si el usuario ya existe
        const userResult = await conexion.query("SELECT * FROM usuario WHERE nombre_usuario = $1", [defaultUsername]);

        if (userResult.rows.length > 0) {
            console.log(`Usuario por defecto ya existe: ${defaultUsername}`);
            return;
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        // Asignar el rol de admin
        const roleResult = await conexion.query("SELECT id_rol FROM rol WHERE tipo_rol = 'admin'");
        const roleId = roleResult.rows[0].id_rol;
        

        // Crear el usuario por defecto
        await conexion.query(
            "INSERT INTO usuario (nombre_usuario, pass, id_rol) VALUES ($1, $2, $3)",
            [defaultUsername, hashedPassword, roleId]
        );

        console.log(`Usuario por defecto creado: ${defaultUsername}`);
    } catch (error) {
        console.error("Error al inicializar el usuario por defecto:", error.message);
    }
};

const initializeDatabase = async () => {
    await initializeDefaultRoles();  // Inicializar roles
    await initializeDefaultUser()
      // Inicializar usuario por defecto
};
initializeDatabase()


module.exports = conexion;

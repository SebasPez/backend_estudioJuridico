const { Pool } = require('pg');
const bcrypt = require('bcrypt');

/**
 * Configuración de la conexión a la base de datos PostgreSQL utilizando el Pool de conexiones.
 * 
 * Esta configuración utiliza el paquete `pg` para crear un pool de conexiones a la base de datos
 * PostgreSQL. Los valores de la configuración son leídos desde las variables de entorno definidas
 * en el archivo `.env`. La configuración incluye detalles como el host, puerto, usuario, contraseña,
 * nombre de la base de datos, y si se debe utilizar SSL dependiendo del entorno de ejecución (producción o no).
 * 
 * @type {Pool} - La instancia del pool de conexiones que se utilizará para realizar consultas a la base de datos.
 * 
 * @example
 * // Ejemplo de uso:
 * const conexion = new Pool({
 *   host: process.env.DB_HOST,
 *   port: process.env.DB_PORT,
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 *   ssl: process.env.MODO === 'produccion' // Utiliza SSL si el entorno es 'produccion'
 * });
 */
const conexion = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.MODO === 'produccion'
});

/**
 * Inicializa los roles por defecto en la base de datos si no existen.
 * 
 * Esta función verifica si los roles `super_admin`, `admin` y `user` ya están presentes en la
 * tabla `rol` de la base de datos. Si algún rol no existe, lo inserta. Si el rol ya existe, 
 * imprime un mensaje en la consola indicando que el rol ya está presente.
 * 
 * La función es ejecutada asíncronamente y maneja cualquier error que pueda ocurrir durante
 * la ejecución, mostrando un mensaje de error en la consola si ocurre alguno.
 * 
 * @returns {Promise<void>} - Una promesa que resuelve cuando todos los roles han sido verificados e insertados si es necesario.
 * 
 * @example
 * // Ejemplo de uso:
 * initializeDefaultRoles().then(() => {
 *   console.log("Roles inicializados correctamente.");
 * }).catch((error) => {
 *   console.log("Error al inicializar roles:", error.message);
 * });
 */
const initializeDefaultRoles = async () => {
    let roles = ['super_admin', 'admin', 'user'];
    try {
        for (let role of roles) {
            // Verificar si el rol ya existe
            const result = await conexion.query("SELECT * FROM rol WHERE tipo_rol = $1", [role]);
            if (result.rows.length === 0) await conexion.query("INSERT INTO rol (tipo_rol) VALUES ($1)", [role]);
            else console.log(`El rol ${role} ya existe.`);
        }
    } catch (error) {
        console.error("Error al inicializar los roles por defecto:", error.message);
    }
}

/**
 * Inicializa el usuario por defecto en la base de datos si no existe.
 * 
 * Esta función verifica si el usuario por defecto, cuyo nombre es `admin`, ya está presente en la
 * tabla `usuario`. Si el usuario ya existe, imprime un mensaje indicando que el usuario por defecto
 * ya está creado. Si no existe, encripta la contraseña por defecto `admin`, obtiene el ID del rol 
 * `super_admin`, y crea un nuevo usuario con ese rol.
 * 
 * La función es ejecutada asíncronamente y maneja cualquier error que pueda ocurrir durante el proceso.
 * 
 * @returns {Promise<void>} - Una promesa que resuelve cuando el usuario por defecto ha sido creado o
 *                            si ya existe, imprime un mensaje en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * initializeDefaultUser().then(() => {
 *   console.log("Usuario por defecto inicializado correctamente.");
 * }).catch((error) => {
 *   console.log("Error al inicializar el usuario por defecto:", error.message);
 * });
 */
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
        const roleResult = await conexion.query("SELECT id_rol FROM rol WHERE tipo_rol = 'super_admin'");
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
    await initializeDefaultUser()// Inicializar usuario por defecto
};
initializeDatabase()


module.exports = conexion;

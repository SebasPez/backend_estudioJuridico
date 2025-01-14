"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Inserta un nuevo usuario administrador en la base de datos.
 * 
 * Esta función toma el nombre de usuario, la contraseña cifrada y el ID del rol 
 * para insertar un nuevo registro en la tabla de usuarios. Si el proceso es exitoso, 
 * devuelve el ID del nuevo usuario.
 * 
 * @param {string} usuario - El nombre del usuario administrador que se desea registrar.
 * @param {string} password - La contraseña cifrada del administrador.
 * @param {number} id_rol - El ID del rol del administrador, que generalmente es 1 para el rol de 'admin'.
 * @returns {Object} - El objeto del nuevo usuario con el ID generado.
 * @throws {Error} - Si ocurre algún error al registrar el usuario, se lanza una excepción.
 * 
 * @example
 * // Ejemplo de uso:
 * const nuevoAdmin = await register('admin', 'hashed_password', 1);
 */
exports.register = async (usuario, password, id_rol) => {
    try {
        const query = `
      INSERT INTO usuario (nombre_usuario, pass, id_rol)
      VALUES ($1, $2, $3)
      RETURNING id_usuario
    `;
        const result = await conexion.query(query, [usuario, password, id_rol]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al registrar usuario.');
    }
};

/**
 * Obtiene todos los usuarios con un rol específico de la base de datos.
 * 
 * Esta función consulta todos los usuarios que tienen un rol determinado (por ejemplo, 
 * 'admin') y devuelve una lista de usuarios ordenada por el nombre de usuario de forma 
 * descendente. Si no se encuentran coincidencias, devuelve una lista vacía.
 * 
 * @param {number} id_rol - El ID del rol que se busca en la base de datos (por ejemplo, 
 * el ID de 'admin').
 * @returns {Promise<Array>} - Una promesa que resuelve con una lista de usuarios que 
 * tienen el rol especificado o una lista vacía si no se encuentran resultados.
 * @throws {Error} - Si ocurre un error en la consulta, se rechaza la promesa con un mensaje de error.
 * 
 * @example
 * // Ejemplo de uso:
 * const admins = await getAll(1); // Obtiene todos los usuarios con el rol 'admin'
 */
exports.getAll = (id_rol) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM USUARIO WHERE id_rol = $1 ORDER BY nombre_usuario DESC`;
        conexion.query(sql, [id_rol], (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener los administradores' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);  // Devuelve una lista vacía si no hay coincidencias
        });
    });
};

/**
 * Elimina un usuario (administrador) de la base de datos.
 * 
 * Esta función recibe el ID de un usuario y ejecuta una consulta SQL para eliminarlo 
 * de la tabla `USUARIO`. Si la eliminación es exitosa, resuelve la promesa con `true`. 
 * Si no se encuentra el usuario o no se elimina ninguna fila, resuelve con `false`. 
 * En caso de error, la promesa se rechaza con el error correspondiente.
 * 
 * @param {number} id - El ID del usuario que se desea eliminar.
 * @param {Object} res - El objeto de respuesta HTTP para manejar cualquier error.
 * @returns {Promise<boolean>} - Una promesa que resuelve con `true` si el usuario fue eliminado 
 * exitosamente o `false` si no se encontró el usuario.
 * @throws {Error} - Si ocurre un error en la consulta, la promesa será rechazada con el error correspondiente.
 * 
 * @example
 * // Ejemplo de uso:
 * const deleted = await deleteUser(1);
 * if (deleted) {
 *     console.log("Usuario eliminado");
 * } else {
 *     console.log("No se pudo eliminar al usuario");
 * }
 */
exports.deleteUser = (id, res) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM USUARIO WHERE id_usuario = $1`;
        conexion.query(sql, [id], (err, resultados) => {
            if (err) return reject(err); // Rechaza la promesa en caso de error
            // En PostgreSQL, puedes comprobar el número de filas afectadas con `rowCount`
            if (resultados.rowCount > 0) return resolve(true); // Éxito, eliminó alguna fila
            else return resolve(false); // No se encontró el análisis para eliminar         
        });
    });
};

/**
 * Servicio para actualizar la contraseña de un usuario en la base de datos.
 * 
 * Esta función actualiza la contraseña de un usuario específico basado en su ID.
 * La contraseña proporcionada ya debe estar encriptada utilizando bcrypt.
 * 
 * @param {Number} id - El ID del usuario cuya contraseña se actualizará.
 * @param {String} pass - La nueva contraseña ya encriptada.
 * 
 * @returns {Object} El resultado de la consulta SQL.
 * 
 * @throws {Error} Si ocurre un error en la base de datos, se lanza una excepción.
 * 
 * @example
 * // Ejemplo de uso:
 * updatePass(1, 'hashedPassword')
 *   .then(result => {
 *     if (result.rowCount > 0) {
 *       console.log("Contraseña actualizada con éxito.");
 *     } else {
 *       console.log("No se encontró el usuario para actualizar.");
 *     }
 *   })
 *   .catch(error => {
 *     console.error(error); // Maneja los errores durante la actualización
 *   });
 */
exports.updatePass = async (id, pass) => {
    const query = `
        UPDATE USUARIO
        SET pass = $1            
        WHERE id_usuario = $2;
    `;
    const values = [pass, id];
    try {
        const result = await conexion.query(query, values);
        return result;
    } catch (err) {
        throw new Error('Error en la base de datos');
    }
};
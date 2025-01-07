"use strict";
const conexion = require('../database/Conexion.js');

exports.get = (nombre, pass) => {
    return new Promise((resolve, reject) => {
        const sql = `select * FROM usuario WHERE nombre_usuario = $1 AND pass = $2`;
        conexion.query(sql, [nombre, pass], (err, resultados) => { 
            if (err) return reject({ status: 500, message: 'Error al obtener el usuario' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);
        });
    });
};

// Función para obtener el nombre del rol a partir de id_rol
exports.getRoleById = async (id_rol) => {
    try {
        const sql = `SELECT tipo_rol FROM rol WHERE id_rol = $1`;
        const result = await conexion.query(sql, [id_rol]);
        if (result.rows.length === 0)return null;
        return result.rows[0].tipo_rol;
    } catch (error) {        
        throw new Error('Error de servidor al consultar el rol');
    }
};

/**
 * Obtiene los detalles de un usuario, incluido su rol, desde la base de datos.
 * 
 * Esta función realiza una consulta SQL para obtener los datos de un usuario 
 * basándose en su nombre de usuario, junto con su rol asociado.
 * 
 * @param {string} nombre_usuario - El nombre de usuario que se desea buscar.
 * @returns {Promise<Object[]>} - Una promesa que se resuelve con un arreglo de objetos
 * que contiene la información del usuario y su rol. Si no se encuentra el usuario, 
 * se devuelve un arreglo vacío.
 * @throws {Error} - Si ocurre un error al ejecutar la consulta SQL.
 * 
 * @example
 * // Ejemplo de uso:
 * getUserWithRole('usuarioEjemplo')
 *   .then(user => {
 *     if (user.length > 0) {
 *       console.log("Usuario encontrado:", user[0]);
 *     } else {
 *       console.log("Usuario no encontrado.");
 *     }
 *   })
 *   .catch(error => {
 *     console.error("Error al obtener el usuario:", error);
 *   });
 */
exports.getUserWithRole = async (nombre_usuario) => {    
    return new Promise((resolve, reject) => {
        const sql = `SELECT u.id_usuario, u.nombre_usuario, u.pass, u.id_rol, r.tipo_rol
                 FROM usuario u
                 INNER JOIN rol r ON u.id_rol = r.id_rol
                 WHERE u.nombre_usuario = $1`;
        conexion.query(sql, [nombre_usuario], (err, resultados) => {            
            if (err) return reject({ status: 500, message: 'Error al obtener el usuario' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);
        });
    });
};

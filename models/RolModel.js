"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Obtiene el ID de un rol a partir de su nombre.
 * 
 * Esta función realiza una consulta SQL para obtener el ID de un rol en la base de datos
 * basándose en el nombre del rol (`tipo_rol`). Si se encuentra el rol, devuelve el ID del rol.
 * Si no se encuentra el rol, devuelve una lista vacía.
 * 
 * @param {string} rol - El nombre del rol cuya ID se desea obtener.
 * @returns {Promise<Object[]>} - Una promesa que se resuelve con un array de objetos que contiene
 * el `id_rol` del rol encontrado. Si no se encuentra el rol, devuelve un array vacío.
 * @throws {Error} - Si ocurre un error al ejecutar la consulta SQL.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * getRoleByName('admin')
 *   .then(roles => {
 *     if (roles.length > 0) {
 *       console.log("ID del rol encontrado:", roles[0].id_rol);
 *     } else {
 *       console.log("Rol no encontrado.");
 *     }
 *   })
 *   .catch(error => {
 *     console.error("Error al obtener el rol:", error);
 *   });
 */
exports.getRoleByName = (rol) => {
    return new Promise((resolve, reject) => {
        const sql = `select id_rol FROM rol WHERE tipo_rol = $1`;
        conexion.query(sql, [rol], (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener el rol' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows);
            resolve([]);
        });
    });
};
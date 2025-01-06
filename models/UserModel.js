"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Registra un nuevo usuario en la base de datos.
 * 
 * @async
 * @function register
 * @param {string} nombre - El nombre del usuario.
 * @param {string} password - La contraseña del usuario.
 * @param {number} id_rol - El ID del rol asignado al usuario.
 * @returns {Object} El nuevo usuario registrado con todos sus datos.
 * @throws {Error} Si ocurre un error al registrar el usuario.
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
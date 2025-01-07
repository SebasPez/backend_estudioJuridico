"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Obtiene los análisis de un cliente específico desde la base de datos.
 * 
 * Esta función recibe el ID de un cliente y ejecuta una consulta SQL para obtener 
 * los análisis correspondientes a ese cliente. Si la consulta tiene éxito y se encuentran 
 * resultados, resuelve la promesa con los análisis. Si no se encuentran análisis, 
 * resuelve con una lista vacía. En caso de error, la promesa se rechaza con el error correspondiente.
 * 
 * @param {number} id_cliente - El ID del cliente cuyos análisis se desean obtener.
 * @returns {Promise<Array>} - Una promesa que resuelve con una lista de análisis del cliente 
 * o una lista vacía si no se encuentran análisis.
 * @throws {Object} - Un objeto de error que se rechaza si ocurre un error en la consulta SQL.
 * 
 * @example
 * // Ejemplo de uso:
 * const análisis = await get(1);
 * if (análisis.length > 0) {
 *     console.log("Análisis encontrados:", análisis);
 * } else {
 *     console.log("No se encontraron análisis.");
 * }
 */
exports.get = (id_cliente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM analisis WHERE id_cliente = $1 ORDER BY id_analisis DESC`;
        conexion.query(sql, [id_cliente], (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener el análisis' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);  // Devuelve una lista vacía si no hay coincidencias
        });
    });
};

/**
 * Elimina un análisis específico de la base de datos.
 * 
 * Esta función recibe el ID de un análisis y ejecuta una consulta SQL para eliminar
 * ese análisis de la base de datos. Si la consulta tiene éxito y se elimina el análisis,
 * resuelve la promesa con `true`. Si no se encuentra el análisis o no se elimina, resuelve 
 * con `false`. En caso de error, la promesa se rechaza con el error correspondiente.
 * 
 * @param {number} id - El ID del análisis que se desea eliminar.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para manejar posibles errores.
 * @returns {Promise<boolean>} - Una promesa que resuelve con `true` si el análisis se eliminó
 * correctamente, o `false` si no se pudo eliminar. En caso de error, se rechaza con el error.
 * @throws {Object} - Un objeto de error que se rechaza si ocurre un error en la consulta SQL.
 * 
 * @example
 * // Ejemplo de uso:
 * const respuesta = await borrar(1);
 * if (respuesta) {
 *     console.log("Análisis eliminado correctamente");
 * } else {
 *     console.log("No se pudo eliminar el análisis");
 * }
 */
exports.borrar = (id, res) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ANALISIS WHERE id_analisis = $1`;
        conexion.query(sql, [id], (err, resultados) => {
            if (err) return reject(err); // Rechaza la promesa en caso de error
            // En PostgreSQL, puedes comprobar el número de filas afectadas con `rowCount`
            if (resultados.rowCount > 0) return resolve(true); // Éxito, eliminó alguna fila
            else return resolve(false); // No se encontró el análisis para eliminar         
        });
    });
};

/**
 * Inserta un nuevo análisis en la base de datos.
 * 
 * Esta función recibe el tipo de análisis y el ID del cliente, y ejecuta una consulta SQL para
 * insertar el análisis en la base de datos. Si la operación es exitosa, se retorna el ID del cliente
 * asociado al análisis insertado. Si ocurre un error, la función lanza una excepción.
 * 
 * @param {string} tipo_analisis - El tipo de análisis que se desea agregar.
 * @param {number} id_cliente - El ID del cliente al que se asociará el análisis.
 * @returns {Promise<number>} - Una promesa que resuelve con el ID del cliente asociado al análisis insertado.
 * 
 * @throws {Error} - Si ocurre un error al ejecutar la consulta SQL, la promesa es rechazada.
 * 
 * @example
 * // Ejemplo de uso:
 * const idCliente = await agregar('Tipo de análisis', 123);
 * console.log(idCliente);  // Muestra el ID del cliente asociado al análisis insertado
 */
exports.agregar = async (tipo_analisis, id_cliente) => {
    const query = `
    INSERT INTO ANALISIS (tipo_analisis, id_cliente) 
    VALUES ($1, $2) RETURNING id_cliente
  `;
    const values = [
        tipo_analisis,
        id_cliente
    ];

    const result = await conexion.query(query, values);
    return result.rows[0].id_cliente;
}
"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Obtiene todos los movimientos de un cliente desde la base de datos.
 * 
 * @param {number} id_cliente - El ID del cliente para el cual se desean obtener los movimientos.
 * @returns {Promise<Array>} - Una promesa que se resuelve con un array de movimientos. Si no hay movimientos, devuelve un array vacío.
 * @throws {Object} - Si ocurre un error durante la consulta, la promesa se rechaza con un objeto de error con un mensaje y un código de estado 500.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * get(1)
 *   .then(movimientos => {
 *     console.log(movimientos);  // Array de movimientos del cliente con ID 1
 *   })
 *   .catch(error => {
 *     console.error(error);  // Si hay un error en la consulta, se captura aquí
 *   });
 */
exports.get = (id_cliente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM MOVIMIENTO WHERE id_cliente = $1 ORDER BY id_movimiento DESC`;
        conexion.query(sql, [id_cliente], (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener los movimientos' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);  // Devuelve una lista vacía si no hay coincidencias
        });
    });
};

// exports.borrar = (id, res) => {
//     return new Promise((resolve, reject) => {
//         const sql = `DELETE FROM ANALISIS WHERE id_analisis = $1`;
//         conexion.query(sql, [id], (err, resultados) => {
//             if (err) return reject(err); // Rechaza la promesa en caso de error
//             // En PostgreSQL, puedes comprobar el número de filas afectadas con `rowCount`
//             if (resultados.rowCount > 0) return resolve(true); // Éxito, eliminó alguna fila
//             else return resolve(false); // No se encontró el análisis para eliminar
//         });
//     });
// };

/**
 * Inserta un nuevo movimiento en la base de datos.
 * 
 * Esta función recibe una descripción y el ID de un cliente y agrega un nuevo movimiento 
 * a la tabla `MOVIMIENTO`. El movimiento se marca con la fecha actual (`CURRENT_DATE`).
 * Después de la inserción, la función devuelve el `id_cliente` asociado al movimiento.
 * 
 * @param {string} descripcion - La descripción del movimiento a agregar.
 * @param {number} id_cliente - El ID del cliente al que se le asociará el movimiento.
 * @returns {Promise<number>} - Una promesa que se resuelve con el `id_cliente` del movimiento 
 *                              agregado si la operación es exitosa.
 * @throws {Object} - Si ocurre un error durante la inserción, la promesa se rechaza con un objeto de error.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * agregar('Nuevo movimiento', 1)
 *   .then(id_cliente => {
 *     console.log(id_cliente);  // ID del cliente asociado al movimiento
 *   })
 *   .catch(error => {
 *     console.error(error);  // Si hay un error en la inserción, se captura aquí
 *   });
 */
exports.agregar = async (descripcion, id_cliente) => {
    const query = `
    INSERT INTO MOVIMIENTO (fecha_mov, descripcion, id_cliente) 
    VALUES (CURRENT_DATE, $1, $2) RETURNING id_cliente
  `;
    const values = [       
        descripcion,
        id_cliente
    ];

    const result = await conexion.query(query, values);
    return result.rows[0].id_cliente;
}
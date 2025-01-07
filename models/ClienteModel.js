"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Obtiene todos los registros de clientes de la base de datos.
 * 
 * Esta función realiza una consulta SQL para obtener todos los registros de la tabla `cliente`,
 * ordenados por el ID del cliente de forma descendente. Si se encuentran resultados, se resuelve
 * con las filas obtenidas; si no hay registros, se resuelve con una lista vacía.
 * 
 * @returns {Promise<Object[]>} - Una promesa que se resuelve con un arreglo de objetos representando los registros de los clientes.
 * @throws {Error} - Si ocurre un error en la consulta SQL al obtener los clientes.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * getAll()
 *   .then(clientes => {
 *     console.log("Clientes obtenidos:", clientes);
 *   })
 *   .catch(error => {
 *     console.error("Error al obtener los clientes:", error);
 *   });
 */
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente ORDER BY id_cliente DESC';
        conexion.query(sql, (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener los clientes' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve solo las filas
            resolve([]);  // Devuelve una lista vacía si no hay tareas
        });
    });
};

/**
 * Actualiza el estado de un cliente en la base de datos.
 * 
 * Esta función realiza una consulta SQL para actualizar el campo `estado` de un cliente,
 * identificado por su `id_cliente`. Si se encuentra al cliente y el estado se actualiza correctamente,
 * devuelve el cliente actualizado con el nuevo estado.
 * 
 * @param {number} id_cliente - El ID del cliente cuyo estado se va a modificar.
 * @param {string} estado - El nuevo estado que se va a asignar al cliente.
 * @returns {Object} - El objeto con el `id_cliente` y el nuevo `estado` actualizado.
 * @throws {Error} - Si ocurre un error al ejecutar la consulta SQL.
 * 
 * @example
 * // Ejemplo de uso de la función:
 * editar(1, 'activo')
 *   .then(cliente => {
 *     console.log("Cliente actualizado:", cliente);
 *   })
 *   .catch(error => {
 *     console.error("Error al actualizar el estado:", error);
 *   });
 */
exports.editar = async (id_cliente, estado) => {
    const query = `
        UPDATE CLIENTE
        SET estado = $1
        WHERE id_cliente = $2
        RETURNING id_cliente, estado;
    `;
    const values = [estado, id_cliente];

    const result = await conexion.query(query, values);
    return result.rows[0];
};
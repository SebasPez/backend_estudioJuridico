"use strict";
const conexion = require('../database/Conexion.js');

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



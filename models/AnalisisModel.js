"use strict";
const conexion = require('../database/Conexion.js');

exports.get = (id_cliente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM analisis WHERE id_cliente = $1`;
        conexion.query(sql, [id_cliente], (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener el análisis' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);  // Devuelve una lista vacía si no hay coincidencias
        });
    });
};
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

exports.borrar = (id, res) => {    
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ANALISIS WHERE id_analisis = $1`;
        conexion.query(sql,[id],(err, resultados) => {           
            if (err) return reject(err); // Rechaza la promesa en caso de error
            // En PostgreSQL, puedes comprobar el número de filas afectadas con `rowCount`
            if (resultados.rowCount > 0) return resolve(true); // Éxito, eliminó alguna fila
            else return resolve(false); // No se encontró el análisis para eliminar         
        });
    });
};
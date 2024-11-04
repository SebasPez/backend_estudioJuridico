"use strict";
const conexion = require('../database/Conexion.js');

exports.getAllTareas = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tareas';
        conexion.query(sql, (err, resultados) => {
            if (err) return reject({ status: 500, message: 'Error al obtener las tareas' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve solo las filas
            resolve([]);  // Devuelve una lista vacía si no hay tareas
        });
    });
};
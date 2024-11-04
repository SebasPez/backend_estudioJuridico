"use strict";
const conexion = require('../database/db_estudio_juridico.js');


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


exports.addTarea = (nombre, apellido, edad) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO tareas (nombre, apellido, edad) VALUES (?, ?, ?)';
        conexion.query(sql, [nombre, apellido, edad], (err, resultados) => {
            try {
                if (err) return;
                if (resultados.affectedRows > 0) return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
};
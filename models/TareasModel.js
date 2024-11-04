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


exports.addTarea = (nombre, apellido, edad, res) => { 
    const query = 'INSERT INTO tareas (nombre, apellido, edad) VALUES ($1, $2, $3)';
    const values = [nombre, apellido, edad];
    conexion.query(query, values, (err, result) => {       
        try {
            if (err) return res.status(404).json({ error: 'Error al agregar la compra:' });
            return res.status(201).json(`Compra agregada exitosamente!`);
        } catch (error) {
            return res.status(500).json({ error: "Error de conexion" });
        }
    });
};
"use strict";
const conexion = require('../database/db_estudio_juridico.js');

exports.addForm = (nombre, apellido, edad, res) => {
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
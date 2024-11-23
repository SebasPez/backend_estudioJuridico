"use strict";
const conexion = require('../database/Conexion.js');

exports.get = (nombre, pass) => {
    return new Promise((resolve, reject) => {
        const sql = `select * FROM usuario WHERE nombre_usuario = $1 AND pass = $2`;
        conexion.query(sql, [nombre, pass], (err, resultados) => { 
            if (err) return reject({ status: 500, message: 'Error al obtener el usuario' });
            if (resultados && resultados.rows.length > 0) return resolve(resultados.rows); // Devuelve las filas si hay resultados
            resolve([]);
        });
    });
};

// Función para obtener el nombre del rol a partir de id_rol
exports.getRoleById = async (id_rol) => {
    try {
        const sql = `SELECT tipo_rol FROM rol WHERE id_rol = $1`;
        const result = await conexion.query(sql, [id_rol]);
        if (result.rows.length === 0)return null;
        return result.rows[0].tipo_rol;
    } catch (error) {        
        throw new Error('Error de servidor al consultar el rol');
    }
};


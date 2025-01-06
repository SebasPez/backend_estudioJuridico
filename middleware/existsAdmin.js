"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Middleware que verifica si el usuario (admin) existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la ruta.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la consulta de la base de datos.
 *
 * Si el usuario especificado existe en la base de datos, responde con un código de estado 404 y un mensaje de error.
 * Si no existe, llama a la función `next` para permitir que la solicitud continúe.
 */
exports.existsAdmin = (req, res, next) => {
    const { usuario } = req.body;
   
    const sql = `SELECT 1 FROM USUARIO WHERE nombre_usuario = $1`;
    conexion.query(sql, [usuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error de servidor' });
        if (results.rows.length > 0) {
            return res.status(404).json({ error: 'El administrador ya figura registrado' });
        }
        return next();
    });
};
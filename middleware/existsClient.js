"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Middleware que verifica si un cliete con el ID especificado existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la ruta.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la consulta de la base de datos.
 *
 * Si el cliente con el ID especificado existe en la base de datos, llama a la función `next` para permitir que la solicitud continúe.
 * Si no existe, responde con un código de estado 404 y un mensaje de error.
 */
exports.existsClient = (req, res, next) => {
    const { id_cliente } = req.params;  
    const sql = `SELECT 1 FROM cliente WHERE id_cliente = $1`;
    conexion.query(sql, [id_cliente], (err, results) => {
        // Si hay un error en la consulta
        if (err) return res.status(500).json({ error: 'Error de servidor' });
        
        // Si no se encontró el cliente
        if (results.rows.length === 0) return res.status(404).json({ error: 'No exiten datos sobre esa persona' });
        
        // Si el cliente existe, pasa al siguiente middleware
        return next();
    });
};

"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Middleware para verificar si un cliente ya existe en la base de datos por nombre.
 * 
 * Este middleware consulta la base de datos para verificar si ya existe un cliente con el nombre proporcionado en 
 * el cuerpo de la solicitud. Si el cliente ya está registrado, se responde con un mensaje de error. Si el cliente 
 * no existe, el flujo de la solicitud continúa con el siguiente middleware o controlador.
 * 
 * @param {Object} req - El objeto de solicitud HTTP, que contiene el cuerpo de la solicitud, incluyendo el `nombre` del cliente.
 * @param {Object} res - El objeto de respuesta HTTP, utilizado para devolver una respuesta de error si el cliente ya existe.
 * @param {Function} next - La función para pasar al siguiente middleware o controlador si el cliente no existe en la base de datos.
 * 
 * @returns {Object} - Respuesta de error si el cliente ya existe, o pasa al siguiente middleware si el cliente no está registrado.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/cliente', existsNewClient, (req, res) => {
 *   // Lógica para agregar un nuevo cliente
 * });
 */
exports.existsNewClient = (req, res, next) => {
    const { nombre } = req.body;
    const sql = `SELECT 1 FROM cliente WHERE nombre = $1`;
    conexion.query(sql, [nombre], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error de servidor' });
        if (results.rows.length > 0) return res.status(400).json({ error: 'Ese cliente ya esta en la base de datos' });
        return next();
    });
};

"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Middleware para verificar si un cliente existe en la base de datos.
 * 
 * Este middleware consulta la base de datos para verificar si un cliente con el `id_cliente` proporcionado en 
 * los parámetros de la solicitud existe en la tabla `cliente`. Si el cliente no existe, se responde con un 
 * mensaje de error. Si el cliente existe, el flujo de la solicitud continúa con el siguiente middleware o controlador.
 * 
 * @param {Object} req - El objeto de solicitud HTTP, que contiene los parámetros de la URL, incluyendo el `id_cliente`.
 * @param {Object} res - El objeto de respuesta HTTP, usado para devolver una respuesta de error si no se encuentra el cliente.
 * @param {Function} next - La función para pasar al siguiente middleware o controlador si el cliente existe.
 * 
 * @returns {Object} - Respuesta de error si el cliente no existe, o pasa al siguiente middleware si el cliente es encontrado.
 * 
 * @example
 * // Ejemplo de uso:
 * app.get('/cliente/:id_cliente', existsClient, (req, res) => {
 *   // Lógica para obtener los datos del cliente
 * });
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

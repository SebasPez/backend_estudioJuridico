"use strict";
const conexion = require('../database/Conexion.js');

/**
 * Middleware para verificar si un administrador ya existe en la base de datos.
 * 
 * Este middleware consulta la base de datos para verificar si el nombre de usuario proporcionado en el cuerpo
 * de la solicitud ya está registrado en la tabla `USUARIO`. Si el administrador ya existe, se responde con un 
 * mensaje de error. Si no existe, el flujo de la solicitud continúa con el siguiente middleware o controlador.
 * 
 * @param {Object} req - El objeto de solicitud HTTP, que contiene el cuerpo con el nombre de usuario.
 * @param {Object} res - El objeto de respuesta HTTP, usado para devolver una respuesta de error en caso de conflicto.
 * @param {Function} next - La función para pasar al siguiente middleware o controlador si el administrador no existe.
 * 
 * @returns {Object} - Respuesta de error si el administrador ya existe, o pasa al siguiente middleware si no existe.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/registro', existsAdmin, (req, res) => {
 *   // Lógica de registro de usuario
 * });
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
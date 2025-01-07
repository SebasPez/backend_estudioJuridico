"use strict";
const conexion = require('../database/Conexion.js');
const bcrypt = require('bcrypt');

/**
 * Middleware para verificar la existencia de un usuario y validar su contraseña.
 * 
 * Este middleware consulta la base de datos para verificar si existe un usuario con el nombre de usuario proporcionado 
 * en el cuerpo de la solicitud. Si el usuario no existe, se responde con un mensaje de error. Si el usuario existe, 
 * se compara la contraseña proporcionada con la contraseña almacenada de manera encriptada en la base de datos.
 * Si la contraseña es incorrecta, se responde con un error. Si la contraseña es correcta, se pasa al siguiente middleware.
 * 
 * @param {Object} req - El objeto de solicitud HTTP, que contiene el cuerpo de la solicitud con `nombre_usuario` y `pass`.
 * @param {Object} res - El objeto de respuesta HTTP, utilizado para devolver respuestas de error si el usuario no existe 
 *                       o si la contraseña es incorrecta.
 * @param {Function} next - La función para pasar al siguiente middleware o controlador si el usuario existe y la contraseña 
 *                           es válida.
 * 
 * @returns {Object} - Respuesta de error si el usuario no existe o la contraseña es incorrecta, o pasa al siguiente 
 *                     middleware si la contraseña es válida.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/login', existsUser, (req, res) => {
 *   // Lógica para iniciar sesión
 * });
 */
exports.existsUser = (req, res, next) => {
    const { nombre_usuario, pass } = req.body;

    // Consulta SQL para obtener la contraseña encriptada del usuario
    const sql = `SELECT pass FROM usuario WHERE nombre_usuario = $1`;
    conexion.query(sql, [nombre_usuario], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error de servidor' });
        // Si no se encuentra el usuario
        if (results.rows.length === 0) return res.status(404).json({ error: 'No existe el usuario' });
        // Obtenemos la contraseña encriptada almacenada en la base de datos
        const hashedPassword = results.rows[0].pass;

        try {
            // Comparamos la contraseña proporcionada con la almacenada en la base de datos
            const isPasswordValid = await bcrypt.compare(pass, hashedPassword);
            if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña incorrecta' });
            
            return next();
        } catch (error) {
            return res.status(500).json({ error: 'Error al comparar la contraseña' });
        }
    });
};
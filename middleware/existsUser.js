"use strict";
const conexion = require('../database/Conexion.js');
const bcrypt = require('bcrypt');

/**
 * Middleware que verifica si un usuario con el nombre y password especificado existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la ruta.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la consulta de la base de datos.
 *
 * Si el usuario con el nombre y password especificado existe en la base de datos, llama a la función `next` para permitir que la solicitud continúe.
 * Si no existe, responde con un código de estado 404 y un mensaje de error.
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
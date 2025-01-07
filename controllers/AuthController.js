"use strict";
const {
    getUserWithRole
} = require('../models/AuthModel.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Maneja el proceso de inicio de sesión del usuario.
 * 
 * Esta función recibe las credenciales del usuario (nombre de usuario y contraseña),
 * valida la existencia del usuario y la correspondencia de la contraseña con la almacenada,
 * y si son correctas, genera un token JWT para autenticación futura. Además, configura 
 * una cookie segura con el token para ser enviada al cliente.
 * 
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} - Una promesa que no retorna valor, ya que responde directamente 
 * al cliente con un código de estado y un mensaje JSON.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/login', (req, res) => {
 *   login(req, res);
 * });
 */
exports.login = async (req, res) => {
    const { nombre_usuario, pass } = req.body;
    try {
        const resp = await getUserWithRole(nombre_usuario);

        // Verificar si se encontró el usuario
        if (resp.length === 0) return res.status(404).json({ error: "Usuario o contraseña incorrectos" })

        const usuario = resp[0]; // Primer resultado de la consulta
        const rol = usuario.tipo_rol; // El nombre del rol ya está en el resultado

        const isPasswordCorrect = await bcrypt.compare(pass, usuario.pass);
        if (!isPasswordCorrect) return res.status(404).json({ error: "Usuario o contraseña incorrectos" });

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario,
                rol: rol,
            },
            process.env.SECRET_KEY, // Clave secreta para firmar el token
            { expiresIn: '1d' } // El token expirará en 1 día
        );

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
            httpOnly: true, // Protege la cookie contra acceso desde JavaScript
            secure: process.env.MODO !== 'developer', // Solo enviar en HTTPS fuera de desarrollo
            sameSite: process.env.MODO !== 'developer' ? 'None' : 'Lax', // Permitir cookies en peticiones cruzadas en producción, // Previene ataques CSRF
            maxAge: 24 * 60 * 60 * 1000,
            // maxAge: 60 * 1000, // Tiempo de expiración: 1 minuto
        });

        return res.status(200).json({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: rol,
            token
        });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Maneja el cierre de sesión del usuario.
 * 
 * Esta función elimina la cookie de autenticación (`authToken`) que se había configurado 
 * durante el inicio de sesión, invalidando así la sesión del usuario. Luego, responde con 
 * un mensaje indicando que la sesión se cerró exitosamente.
 * 
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} - Una promesa que no retorna valor, ya que responde directamente 
 * al cliente con un código de estado y un mensaje JSON.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/logout', (req, res) => {
 *   logout(req, res);
 * });
 */
exports.logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.MODO !== 'developer', // Coincide con la configuración de creación
        sameSite: process.env.MODO !== 'developer' ? 'None' : 'Lax', // Coincide con la configuración de creación
    });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

/**
 * Recupera los datos protegidos del usuario autenticado.
 * 
 * Esta función responde con los datos del usuario autenticado, que se encuentran en el 
 * objeto `req.user` (normalmente establecido por un middleware de autenticación). 
 * La respuesta se devuelve con un código de estado 200.
 * 
 * @param {Object} req - El objeto de solicitud HTTP, que contiene los datos del usuario 
 * autenticado en `req.user`.
 * @param {Object} res - El objeto de respuesta HTTP, con el que se devuelve la respuesta 
 * al cliente.
 * @returns {Object} - Un objeto JSON con los datos del usuario autenticado.
 * 
 * @example
 * // Ejemplo de uso:
 * app.get('/protected-data', (req, res) => {
 *   getProtectedData(req, res);
 * });
 */
exports.getProtectedData = (req, res) => {
    res.status(200).json({ user: req.user });
};
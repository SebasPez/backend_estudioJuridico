const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación para proteger las rutas.
 * 
 * Este middleware verifica la validez de un token de autenticación JWT enviado en las cookies de la solicitud.
 * Si el token no está presente o es inválido, se retorna una respuesta de error con el código de estado adecuado.
 * Si el token es válido, los datos del usuario decodificados se almacenan en `req.user` y se permite continuar
 * con la siguiente función en la cadena de middlewares o controlador.
 * 
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función para pasar al siguiente middleware o controlador.
 * 
 * @returns {Object} - Respuesta de error en caso de token no encontrado o inválido, o pasa al siguiente middleware.
 * 
 * @example
 * // Ejemplo de uso:
 * app.use('/ruta-protegida', authMiddleware, (req, res) => {
 *   res.status(200).json({ message: 'Acceso autorizado' });
 * });
 */
exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "No autorizado. Por favor, inicia sesión." });
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Almacenar los datos decodificados del usuario en la solicitud
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

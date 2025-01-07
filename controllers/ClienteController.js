"use strict";
const {
    getAll,editar
} = require('../models/ClienteModel.js');

/**
 * Obtiene todos los clientes de la base de datos.
 * 
 * Este controlador maneja la solicitud HTTP para obtener todos los registros de la tabla `cliente`. 
 * Si hay clientes en la base de datos, se devuelve una respuesta con los datos. 
 * Si no se encuentran clientes, se devuelve un error con un mensaje adecuado. 
 * Si ocurre algún error en el servidor, se maneja con un error de servidor.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 si se encuentran clientes, o un error 404 si no hay clientes.
 * @throws {Error} - Si ocurre un error en el servidor al obtener los clientes.
 * 
 * @example
 * // Solicitud GET para obtener todos los clientes
 * GET /clientes
 * 
 * // Respuesta exitosa:
 * 200 OK
 * {
 *   "response": [
 *     { "id_cliente": 1, "nombre": "Juan", "apellido": "Pérez" },
 *     { "id_cliente": 2, "nombre": "Ana", "apellido": "Gómez" }
 *   ]
 * }
 * 
 * // Respuesta con error de no encontrar clientes:
 * 404 Not Found
 * {
 *   "error": "No hay clientes en la base de datos"
 * }
 * 
 * // Respuesta de error de servidor:
 * 500 Internal Server Error
 * {
 *   "error": "Error de servidor"
 * }
 */
exports.getAll = async (req, res) => {
    try {
        let response = await getAll();       
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay clientes en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Actualiza el estado de un cliente en la base de datos.
 * 
 * Este controlador maneja la solicitud HTTP para actualizar el estado de un cliente específico,
 * identificado por su `id_cliente`. Si el cliente es encontrado y el estado se actualiza con éxito,
 * se emite un evento a través de `io.emit` y se devuelve una respuesta exitosa. Si falta información o
 * no se puede actualizar el estado, se devuelve un error adecuado.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @param {Object} io - El objeto para emitir eventos a través de WebSockets.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 si se actualiza el estado exitosamente,
 * o un error 404 si no se puede cambiar el estado.
 * @throws {Error} - Si ocurre un error en el servidor al actualizar el estado.
 * 
 * @example
 * // Solicitud PUT para actualizar el estado de un cliente
 * PUT /clientes/:id_cliente/estado/:estado
 * 
 * // Respuesta exitosa:
 * 200 OK
 * {
 *   "message": "Estado modificado exitosamente!",
 *   "data": { "id_cliente": 1, "estado": "activo" }
 * }
 * 
 * // Respuesta con error de falta de datos:
 * 400 Bad Request
 * {
 *   "error": "Faltan datos necesarios para editar"
 * }
 * 
 * // Respuesta de error al no poder cambiar el estado:
 * 404 Not Found
 * {
 *   "error": "El estado no se pudo cambiar"
 * }
 * 
 * // Respuesta de error de servidor:
 * 500 Internal Server Error
 * {
 *   "error": "Error de servidor"
 * }
 */
exports.editar = async (req, res,io) => {
    const { id_cliente, estado } = req.params;

    if (!id_cliente || !estado) return res.status(400).json({ error: "Faltan datos necesarios para editar" });

    try {
        const updatedAnalisis = await editar(id_cliente, estado);
        if (!updatedAnalisis) return res.status(404).json({ error: "El estado no se pudo cambiar" });
        io.emit('nuevo-estado', { id_cliente });
        return res.status(200).json({ message: "Estado modificado exitosamente!", data: updatedAnalisis });
    } catch (error) {       
        res.status(500).json({ error: "Error de servidor" });
    }
};
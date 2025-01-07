"use strict";
const {
    get, agregar
} = require('../models/MovimientoModel.js');

/**
 * Obtiene los movimientos de un cliente específico.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud, incluyendo el `id_cliente`.
 * @param {number} req.params.id_cliente - El ID del cliente para el cual se solicitan los movimientos.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Object} - Respuesta HTTP con un código de estado y los movimientos obtenidos.
 * @throws {Error} - Si ocurre un error durante la obtención de los movimientos, se devuelve un error 500.
 * 
 * @example
 * // Solicitud GET para obtener los movimientos de un cliente con ID 1
 * GET /movimiento/1
 */
exports.get = async (req, res) => {
    const { id_cliente } = req.params;  
    try {
        let response = await get(id_cliente);
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se han realizado movimientos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// exports.borrar = async (req, res) => {
//     const { id_analisis } = req.params;
//     try {
//         let response = await borrar(id_analisis, res)

//         if (response) return res.status(200).json(`Analisis borrado con éxito`);
//         else return res.status(404).json({ error: "Error: No se ha podido eliminar" })
//     } catch (error) {
//         return res.status(500).json({ error: "Error de servidor" });
//     }
// };

/**
 * Crea un nuevo movimiento y lo asocia a un cliente específico.
 * 
 * Esta función maneja la solicitud HTTP para agregar un nuevo movimiento a la base de datos. 
 * Si el movimiento se agrega con éxito, se emite un evento `nuevo-movimiento` usando `io` 
 * para notificar a los clientes conectados sobre el nuevo movimiento.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP que contiene los datos del movimiento.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene la descripción y el ID del cliente.
 * @param {string} req.body.descripcion - La descripción del movimiento.
 * @param {number} req.body.id_cliente - El ID del cliente al que se le asociará el movimiento.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @param {Object} io - El objeto Socket.IO utilizado para emitir eventos a los clientes conectados.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 si el movimiento se agrega con éxito, 
 *                     o un código de estado 404 si no se pudo agregar el movimiento, 
 *                     o 500 si ocurrió un error del servidor.
 * @throws {Error} - Si ocurre un error al intentar agregar el movimiento.
 * 
 * @example
 * // Solicitud POST para agregar un movimiento con descripción y cliente ID 1
 * POST /movimiento
 * {
 *   "descripcion": "Movimiento de prueba",
 *   "id_cliente": 1
 * }
 */
exports.agregar = async (req, res, io) => {
    const { descripcion, id_cliente } = req.body;  
    try {
        const id = await agregar(descripcion, id_cliente);
        if (!id) return res.status(404).json({ error: "El movimiento no se puedo agregar" });
        io.emit('nuevo-movimiento', { id });
        return res.status(200).json({ message: `Movimiento creado exitosamente` });
    } catch (error) {       
        res.status(500).json({ error: 'Error al insertar datos' });
    }
}
"use strict";
const {
    get, borrar, agregar
} = require('../models/AnalisisModel.js');

/**
 * Obtiene el análisis de un cliente específico desde la base de datos.
 * 
 * Esta función recibe el ID de un cliente desde los parámetros de la solicitud, 
 * luego llama a la función auxiliar `get` para obtener los análisis correspondientes 
 * en la base de datos. Si se encuentran análisis, se devuelve la lista de análisis. 
 * Si no se encuentran análisis para el cliente, se retorna un mensaje de error. 
 * En caso de error en el servidor, se devuelve un mensaje de error de servidor.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que contiene los parámetros necesarios 
 * para obtener los análisis.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @returns {Object} - Un objeto JSON que contiene los análisis del cliente o un mensaje de error.
 * 
 * @example
 * // Ejemplo de uso:
 * app.get('/analisis/:id_cliente', (req, res) => {
 *   get(req, res);
 * });
 */
exports.get = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        let response = await get(id_cliente);
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se ha realizado ningún análisis" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Borra un análisis específico de la base de datos.
 * 
 * Esta función recibe el ID de un análisis desde los parámetros de la solicitud,
 * luego llama a la función auxiliar `borrar` para eliminar el análisis correspondiente
 * en la base de datos. Si la eliminación es exitosa, se retorna un mensaje de éxito.
 * Si no se puede eliminar el análisis, se retorna un mensaje de error. En caso de
 * error en el servidor, se devuelve un mensaje de error.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que contiene los parámetros necesarios
 * para eliminar el análisis.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @returns {Object} - Un objeto JSON que contiene un mensaje de éxito o un mensaje de error.
 * 
 * @example
 * // Ejemplo de uso:
 * app.delete('/analisis/:id_analisis', (req, res) => {
 *   borrar(req, res);
 * });
 */
exports.borrar = async (req, res) => {
    const { id_analisis } = req.params;
    try {
        let response = await borrar(id_analisis, res)
        if (response) return res.status(200).json({ message: `Analisis borrado con éxito` });
        else return res.status(404).json({ error: "Error: No se ha podido eliminar" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Agrega un nuevo análisis en la base de datos y emite un evento a través de WebSocket.
 * 
 * Esta función recibe los datos del análisis (tipo de análisis e ID del cliente) desde el cuerpo
 * de la solicitud, llama a la función auxiliar `agregar` para insertar los datos en la base de datos.
 * Si la operación es exitosa, se emite un evento `nuevo-analisis` con el ID del análisis a través de
 * WebSocket (usando la instancia `io`). Si no se puede agregar el análisis, se retorna un error.
 * En caso de error en el servidor, se retorna un mensaje de error.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que contiene los datos necesarios para agregar el análisis.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @param {Object} io - La instancia de WebSocket utilizada para emitir eventos.
 * @returns {Object} - Un objeto JSON que contiene un mensaje de éxito o un mensaje de error.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/analisis', (req, res) => {
 *   agregar(req, res, io);
 * });
 */
exports.agregar = async (req, res, io) => {
    const { tipo_analisis, id_cliente } = req.body;
    try {
        const id = await agregar(tipo_analisis, id_cliente);
        if (!id) return res.status(404).json({ error: "El análisis no se puedo agregar" });
        io.emit('nuevo-analisis', { id });
        return res.status(200).json({ message: `Análisis creado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: 'Error se servidor' });
    }
}


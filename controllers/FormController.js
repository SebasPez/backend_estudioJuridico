"use strict";
const {
    insertCliente, insertDatosJubilatorios, insertDocAcompaniada, getDatosJubilatorios, editDatoJubilatorio
} = require('../models/FormModel.js');

/**
 * Inserta los datos de un nuevo cliente y sus datos jubilatorios en la base de datos.
 * 
 * Este controlador maneja la solicitud HTTP para insertar un nuevo cliente en la base de datos. 
 * Primero, se insertan los datos del cliente, luego los datos jubilatorios asociados a ese cliente. 
 * Si se proporciona un arreglo de documentos acompañantes, también se insertan en la tabla correspondiente.
 * Finalmente, se emite un evento `nuevo-cliente` usando Socket.IO para notificar a los clientes conectados.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP que contiene los datos del cliente.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene la información del cliente.
 * @param {string} req.body.nombre - El nombre del cliente.
 * @param {string} req.body.cuil - El CUIL del cliente.
 * @param {number} req.body.edad - La edad del cliente.
 * @param {string} req.body.localidad - La localidad del cliente.
 * @param {string} req.body.celular - El celular del cliente.
 * @param {string} req.body.mail - El correo electrónico del cliente.
 * @param {string} req.body.clave_abc - La clave ABC del cliente (opcional).
 * @param {string} req.body.estado_civil - El estado civil del cliente (opcional).
 * @param {string} req.body.cod_postal - El código postal del cliente (opcional).
 * @param {string[]} req.body.documental_acomp - Un arreglo de documentos acompañantes (opcional).
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @param {Object} io - El objeto Socket.IO utilizado para emitir eventos a los clientes conectados.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 si los datos se insertan con éxito.
 * @throws {Error} - Si ocurre un error al insertar los datos del cliente o jubilatorios.
 * 
 * @example
 * // Solicitud POST para insertar un nuevo cliente
 * POST /cliente
 * {
 *   "nombre": "Juan Pérez",
 *   "cuil": "20-12345678-9",
 *   "edad": 45,
 *   "localidad": "Ciudad de Buenos Aires",
 *   "celular": "123456789",
 *   "mail": "juan.perez@mail.com",
 *   "clave_abc": "ABC123",
 *   "estado_civil": "Soltero",
 *   "documental_acomp": ["documento1.pdf", "documento2.pdf"]
 * }
 */
exports.insertarCliente = async (req, res, io) => {
    const data = req.body;
    let estado = "pendiente"
    try {
        // Inserta los datos en la tabla CLIENTE y obtiene el ID       
        const id_cliente = await insertCliente(data, estado);

        // Inserta los datos en la tabla DATOS_JUBILATORIOS y obtiene el ID
        const id_jubilacion = await insertDatosJubilatorios(data, id_cliente);

        // Inserta los datos en la tabla DOC_ACOMPANIADA si existe documental_acomp
        if (Array.isArray(data.documental_acomp)) {
            await insertDocAcompaniada(id_jubilacion, data.documental_acomp);
        }
        io.emit('nuevo-cliente', { id_cliente });
        res.status(200).json({ message: 'Datos insertados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar datos' });
    }
}

/**
 * Obtiene los datos jubilatorios de un cliente específico.
 * 
 * Este controlador maneja la solicitud HTTP para obtener los datos jubilatorios de un cliente, identificados por su `id_cliente`.
 * Si se encuentran datos jubilatorios registrados, se devuelve una respuesta con un estado 200 y los datos en formato JSON.
 * Si no se encuentran datos jubilatorios, se devuelve un estado 404 con un mensaje indicando que no se han registrado datos jubilatorios.
 * En caso de error en el servidor, se devuelve un estado 500 con un mensaje de error.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud que incluyen `id_cliente`.
 * @param {string} req.params.id_cliente - El ID del cliente cuya información jubilatoria se busca.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 y los datos si los encuentra, o 404 si no hay datos.
 * @throws {Error} - Si ocurre un error al obtener los datos jubilatorios.
 * 
 * @example
 * // Solicitud GET para obtener los datos jubilatorios de un cliente
 * GET /datos-jubilatorios/1
 * 
 * // Respuesta exitosa:
 * 200 OK
 * {
 *   "response": [/* Datos jubilatorios del cliente *//*]
* }
* 
* // Respuesta sin datos jubilatorios:
* 404 Not Found
* {
*   "error": "Aún no se han registrado datos jubilatorios de dicha persona"
* }
* 
* // Respuesta de error:
* 500 Internal Server Error
* {
*   "error": "Error de servidor"
* }
*/
exports.getDatosJubilatorios = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        let response = await getDatosJubilatorios(id_cliente);
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se han registrado datos jubilatorios de dicha persona" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Edita un dato jubilatorio en la base de datos.
 * 
 * Este controlador maneja la solicitud HTTP para editar un dato jubilatorio de un cliente o de un registro en la tabla `datos_jubilatorios`.
 * Se reciben parámetros en la URL, incluyendo la tabla, el ID del registro, el atributo a editar y el nuevo dato. 
 * Si los parámetros son válidos, se actualiza el dato en la base de datos y se emite un evento de WebSocket para notificar el cambio.
 * Si no se encuentra el dato o hay algún problema en la edición, se devuelve un error correspondiente.
 * 
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud que incluyen `tabla`, `id`, `atr` y `dato`.
 * @param {string} req.params.tabla - La tabla que contiene el dato a editar (por ejemplo, `datos_jubilatorios` o `cliente`).
 * @param {number} req.params.id - El ID del registro que se desea editar.
 * @param {string} req.params.atr - El nombre del atributo a editar.
 * @param {string} req.params.dato - El nuevo valor del atributo.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta.
 * @param {Object} io - El objeto de WebSocket utilizado para emitir eventos.
 * @returns {Object} - Respuesta HTTP con un código de estado 200 si la edición fue exitosa, o un error correspondiente.
 * @throws {Error} - Si ocurre un error en el servidor al editar el dato.
 * 
 * @example
 * // Solicitud PUT para editar un dato jubilatorio
 * PUT /edit-dato-jubilatorio/datos_jubilatorios/1/clave_afip/12345678
 * 
 * // Respuesta exitosa:
 * 200 OK
 * {
 *   "message": "Dato editado exitosamente",
 *   "data": {
 *     "id_jubilacion": 1,
 *     "clave_afip": "12345678"
 *   }
 * }
 * 
 * // Respuesta con error de parámetros faltantes:
 * 400 Bad Request
 * {
 *   "error": "Faltan datos necesarios para editar"
 * }
 * 
 * // Respuesta de error en la base de datos:
 * 404 Not Found
 * {
 *   "error": "No fue posible cambiar el dato"
 * }
 * 
 * // Respuesta de error de servidor:
 * 500 Internal Server Error
 * {
 *   "error": "Error de servidor"
 * }
 */
exports.editDatoJubilatorio = async (req, res, io) => {
    const { tabla, id, atr, dato } = req.params;
    if (!id || !atr || !dato) return res.status(400).json({ error: "Faltan datos necesarios para editar" });

    try {
        const updatedAnalisis = await editDatoJubilatorio(tabla, id, atr, dato);
        if (!updatedAnalisis) return res.status(404).json({ error: "No fue posible cambiar el dato" });
        io.emit('nueva-data', { updatedAnalisis });
        return res.status(200).json({ message: "Dato editado exitosamente", data: updatedAnalisis });
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
};
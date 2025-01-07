"use strict";
const {
    register, getAll, deleteUser
} = require('../models/UserModel.js');

const {
    getRoleByName
} = require('../models/RolModel.js');

const bcrypt = require('bcrypt');

/**
 * Registra un nuevo administrador en el sistema.
 * 
 * Esta función valida si las contraseñas proporcionadas coinciden, luego genera una 
 * contraseña cifrada utilizando bcrypt y finalmente inserta un nuevo registro de 
 * administrador en la base de datos. Si el registro es exitoso, devuelve los datos del nuevo 
 * administrador. Si ocurre algún error, responde con el mensaje adecuado.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que contiene los datos del nuevo 
 * administrador (`usuario`, `password`, `rePassword`).
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @returns {Object} - Un objeto JSON con un mensaje de éxito y los datos del nuevo administrador, 
 * o un mensaje de error si ocurre algún problema.
 * 
 * @example
 * // Ejemplo de uso:
 * app.post('/register', (req, res) => {
 *   register(req, res);
 * });
 */
exports.register = async (req, res) => {
    const { usuario, password, rePassword } = req.body;    
    try {
        if (password !== rePassword) {
            return res.status(404).json({ error: 'Las contraseñas no coinciden.' });
        }
        const id_rol = await getRoleByName('admin');

        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ahora la función devuelve todos los datos del admin
        const nuevoAdmin = await register(
            usuario,
            hashedPassword,
            id_rol[0].id_rol
        );

        if (!nuevoAdmin) return res.status(404).json({ error: 'No se pudo registrar.' })
        
        return res.status(200).json({ message: 'Administrador registrado exitosamente.', data: nuevoAdmin });
    } catch (error) {
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};

/**
 * Obtiene todos los administradores registrados en la base de datos.
 * 
 * Esta función primero verifica si existe el rol de 'admin' en la base de datos. Luego, 
 * consulta todos los usuarios con ese rol y devuelve una lista de administradores ordenada 
 * por nombre de usuario en orden descendente. Si no se encuentran administradores, se 
 * devuelve un mensaje de error. Si ocurre algún error, se maneja mediante una respuesta 
 * de error del servidor.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que puede contener parámetros necesarios 
 * para realizar la consulta.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @returns {Object} - Un objeto JSON con la lista de administradores o un mensaje de error si 
 * no se encuentran administradores o si ocurre un problema con la consulta.
 * 
 * @example
 * // Ejemplo de uso:
 * app.get('/get-all', (req, res) => {
 *   getAll(req, res);
 * });
 */
exports.getAll = async (req, res) => {   
    try {
        const id_rol = await getRoleByName('admin');
        if (!id_rol[0].id_rol) return res.status(404).json({ error: "No existe el rol administrador" });
        let response = await getAll(id_rol[0].id_rol);        
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "Aún no se han registrado administradores" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};

/**
 * Elimina un usuario (administrador) de la base de datos.
 * 
 * Esta función recibe el ID de un usuario desde los parámetros de la solicitud, 
 * luego llama a la función auxiliar `deleteUser` para eliminar el usuario correspondiente 
 * en la base de datos. Si la eliminación es exitosa, se devuelve un mensaje de éxito, 
 * de lo contrario, se retorna un mensaje de error si no se puede eliminar el usuario.
 * Si ocurre un error en el servidor, se devuelve un mensaje de error de servidor.
 * 
 * @param {Object} req - El objeto de solicitud HTTP que contiene los parámetros necesarios 
 * para realizar la eliminación.
 * @param {Object} res - El objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
 * @returns {Object} - Un objeto JSON que indica el resultado de la operación (éxito o error).
 * 
 * @example
 * // Ejemplo de uso:
 * app.delete('/delete-user/:id_usuario', (req, res) => {
 *   deleteUser(req, res);
 * });
 */
exports.deleteUser = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        let response = await deleteUser (id_usuario, res)
        if (response) return res.status(200).json({ message: `Administrador borrado con éxito` });
        else return res.status(404).json({ error: "Error: No se ha podido eliminar" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};
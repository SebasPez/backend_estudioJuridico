"use strict";
const {
    get, getRoleById
} = require('../models/AdminModel.js');

exports.login = async (req, res) => {
    const { nombre_usuario, pass } = req.body;   
    try {
        // Obtener el usuario y su id_rol
        const resp = await get(nombre_usuario, pass);
        if (!resp) return res.status(404).json({ error: "Usuario o contraseña incorrectos" });
        
        const usuario = resp[0];
        const rol = await getRoleById(usuario.id_rol);
       
        if (!rol) return res.status(404).json({ error: "Rol no encontrado" });
        
        return res.status(200).json({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: rol
        });

    } catch (error) {       
        return res.status(500).json({ error: "Error de servidor" });
    }
};


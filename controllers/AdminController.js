"use strict";
const {
    get, getRoleById
} = require('../models/AdminModel.js');

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { nombre_usuario, pass } = req.body;    
    try {
        // Obtener el usuario y su id_rol
        const resp = await get(nombre_usuario, pass);
        if (!resp) return res.status(404).json({ error: "Usuario o contraseña incorrectos" });
        
        const usuario = resp[0];
        const rol = await getRoleById(usuario.id_rol);
       
        if (!rol) return res.status(404).json({ error: "Rol no encontrado" });
    
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario,
                rol: rol.nombre_rol, // Ejemplo de agregar el nombre del rol
            },
            process.env.SECRET_KEY, // Clave secreta para firmar el token
            { expiresIn: '1d' } // El token expirará en 1 día
        );       

        // Configurar la cookie con el token
        res.cookie('authToken', token, {
            httpOnly: true, // Protege la cookie contra acceso desde JavaScript
            secure: process.env.MODO !== 'developer', // Solo enviar en HTTPS fuera de desarrollo
            sameSite: 'Strict', // Previene ataques CSRF
            maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración: 1 día
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

exports.logout = (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

exports.getProtectedData = (req, res) => {
    res.status(200).json({ user: req.user });
};
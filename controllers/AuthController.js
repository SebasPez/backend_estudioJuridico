"use strict";
const {
    getUserWithRole
} = require('../models/AuthModel.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    
    const { nombre_usuario, pass } = req.body;
   
    try {   
        const resp = await getUserWithRole(nombre_usuario);
       
        // Verificar si se encontró el usuario
        if (resp.length === 0) {
            return res.status(404).json({ error: "Usuario o contraseña incorrectos" });
        }

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

exports.logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.MODO !== 'developer', // Coincide con la configuración de creación
        sameSite: process.env.MODO !== 'developer' ? 'None' : 'Lax', // Coincide con la configuración de creación
    });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

exports.getProtectedData = (req, res) => {
    res.status(200).json({ user: req.user });
};
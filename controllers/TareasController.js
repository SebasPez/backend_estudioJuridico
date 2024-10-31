"use strict";
const {   
    getAllTareas
    } = require('../models/TareasModel.js');

exports.getAllTareas = async (req, res) => {
    try {
        let response = await getAllTareas();       
        if (response && response.length > 0)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay tareas en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};


exports.getDataForm = async (req, res) => {
    try {
        const { nombre, apellido, edad } = req.body; // Da
        console.log(nombre, apellido, edad)
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};
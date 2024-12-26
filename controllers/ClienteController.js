"use strict";
const {
    getAll,editar
} = require('../models/ClienteModel.js');

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
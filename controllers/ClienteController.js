"use strict";
const {
    getAll,
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
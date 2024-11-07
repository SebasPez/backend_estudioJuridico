"use strict";
const {
    get
} = require('../models/AnalisisModel.js');

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
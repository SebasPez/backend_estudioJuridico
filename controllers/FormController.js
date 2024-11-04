"use strict";
const {    
    addForm
} = require('../models/FormModel.js');

exports.addForm = async (req, res) => {
    try {
        const { nombre, apellido, edad } = req.body;

        addForm(nombre, apellido, edad, res)
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
};
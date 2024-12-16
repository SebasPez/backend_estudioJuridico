"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const form = require('../controllers/FormController.js')
const { existsClient } = require('../middleware/existsClient.js');
const { authMiddleware } = require("../middleware/authMiddleware");


module.exports = (io) => {
    router.post('/formulario', form.insertarCliente);
    router.get('/formulario/:id_cliente', existsClient, authMiddleware, form.getDatosJubilatorios);
    router.put('/formulario/:tabla/:id/:atr/:dato', (req, res) => form.editDatoJubilatorio(req, res, io));
    
    return router;
};
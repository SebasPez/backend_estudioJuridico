"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const form = require('../controllers/FormController.js')
const { existsClient } = require('../middleware/existsClient.js');

router.post('/formulario', form.insertarCliente);
router.get('/formulario/:id_cliente', existsClient, form.getDatosJubilatorios);

module.exports = router;
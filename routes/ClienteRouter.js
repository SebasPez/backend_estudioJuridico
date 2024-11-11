"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const cliente = require('../controllers/ClienteController.js');

// Ruta para obtener materia prima por nombre
router.get('/cliente', cliente.getAll);
router.put('/cliente/:id_cliente/:estado', cliente.editar);


module.exports = router;
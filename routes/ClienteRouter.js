"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const cliente = require('../controllers/ClienteController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

// Ruta para obtener materia prima por nombre
router.get('/cliente', cliente.getAll);
router.put('/cliente/:id_cliente/:estado', authMiddleware, cliente.editar);


module.exports = router;
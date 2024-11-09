"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const mov = require('../controllers/MoviemientoController.js');

// Ruta para obtener materia prima por nombre
router.get('/movimiento/:id_cliente', mov.get);
// router.delete('/analisis/:id_analisis', analisis.borrar);
router.post('/movimiento', mov.agregar);

module.exports = router;
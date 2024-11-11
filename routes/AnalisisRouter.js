"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const analisis = require('../controllers/AnalisisController.js');

// Ruta para obtener materia prima por nombre
router.get('/analisis/:id_cliente', analisis.get);
router.delete('/analisis/:id_analisis', analisis.borrar);
router.post('/analisis', analisis.agregar);


module.exports = router;
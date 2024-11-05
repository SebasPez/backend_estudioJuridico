"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const tareas = require('../controllers/TareasController.js')


// Ruta para obtener materia prima por nombre
router.get('/tareas', tareas.getAllTareas);


module.exports = router;
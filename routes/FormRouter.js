"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const form = require('../controllers/FormController.js')

// Ruta para obtener materia prima por nombre
router.post('/formulario', form.addForm);

module.exports = router;
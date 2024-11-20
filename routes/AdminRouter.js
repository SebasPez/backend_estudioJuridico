"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const admin = require('../controllers/AdminController.js');
const { existsUser } = require('../middleware/existsUser.js');
// Ruta para obtener materia prima por nombre
router.post('/admin/login', existsUser, admin.login);

module.exports = router;
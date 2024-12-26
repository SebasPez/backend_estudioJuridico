"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const analisis = require('../controllers/AnalisisController.js');
const { authMiddleware } = require("../middleware/authMiddleware");

module.exports = (io) => {
    router.get('/analisis/:id_cliente', authMiddleware, analisis.get);
    router.delete('/analisis/:id_analisis', analisis.borrar);
    router.post('/analisis', authMiddleware, (req, res) => analisis.agregar(req, res, io));

    return router;
};
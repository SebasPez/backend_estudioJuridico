"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const analisis = require('../controllers/AnalisisController.js');

module.exports = (io) => {
    router.get('/analisis/:id_cliente', analisis.get);
    router.delete('/analisis/:id_analisis', analisis.borrar);
    router.post('/analisis', (req, res) => analisis.agregar(req, res, io));

    return router;
};
"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const mov = require('../controllers/MoviemientoController.js');

module.exports = (io) => {

    router.get('/movimiento/:id_cliente', mov.get);
    // router.delete('/analisis/:id_analisis', analisis.borrar);
    router.post('/movimiento', (req, res) => mov.agregar(req, res, io));

    return router;
};
"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const {get, agregar} = require('../controllers/MoviemientoController.js');
const { authMiddleware } = require("../middleware/authMiddleware");

// DUCUMENTACIÓN SWAGGER

/**
 * @swagger
 * tags:
 *   name: Movimientos
 *   description: Endpoints para gestionar movimientos sobre los clientes
 */

/**
 * @swagger
 * /movimiento/{id_cliente}:
 *   get:
 *     summary: Obtiene los movimientos de un cliente.
 *     description: Devuelve una lista de movimientos asociados a un cliente específico por su ID.
 *     tags:
 *       - Movimientos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del cliente para obtener sus movimientos.
 *         example: 123
 *     responses:
 *       200:
 *         description: Lista de movimientos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: 
 *                     - id_movimiento: 1
 *                       fecha: "2025-01-01"
 *                       monto: 5000.0
 *                       tipo: "Depósito"
 *                     - id_movimiento: 2
 *                       fecha: "2025-01-03"
 *                       monto: 2000.0
 *                       tipo: "Retiro"
 *       404:
 *         description: No se encontraron movimientos para el cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aún no se han realizado movimientos"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error de servidor"
 */

/**
 * @swagger
 * /movimiento:
 *   post:
 *     summary: Agrega un nuevo movimiento.
 *     description: Crea un nuevo movimiento asociado a un cliente y emite un evento a través de WebSockets.
 *     tags:
 *       - Movimientos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción del movimiento.
 *                 example: "Pago de factura"
 *               id_cliente:
 *                 type: integer
 *                 description: ID único del cliente asociado al movimiento.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Movimiento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movimiento creado exitosamente"
 *       404:
 *         description: No se pudo agregar el movimiento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El movimiento no se pudo agregar"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al insertar datos"
 */

module.exports = (io) => {

    router.get('/movimiento/:id_cliente',authMiddleware, get);
    // router.delete('/analisis/:id_analisis', borrar);
    router.post('/movimiento', authMiddleware, (req, res) => agregar(req, res, io));

    return router;
};
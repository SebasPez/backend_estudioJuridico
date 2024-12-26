"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const cliente = require('../controllers/ClienteController.js');
const form = require('../controllers/FormController.js')
const {authMiddleware} = require('../middleware/authMiddleware');
const { existsNewClient } = require('../middleware/existsNewClient.js');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gestionar clientes
 */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_cliente:
 *                     type: integer
 *                     description: ID único del cliente
 *                   nombre:
 *                     type: string
 *                     description: Nombre del cliente
 *                   estado:
 *                     type: string
 *                     description: Estado del cliente
 *       404:
 *         description: No se encontraron clientes
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /cliente/{id_cliente}/{estado}:
 *   put:
 *     summary: Edita el estado de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *       - in: path
 *         name: estado
 *         schema:
 *           type: string
 *         required: true
 *         description: Nuevo estado del cliente
 *     responses:
 *       200:
 *         description: Cliente editado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Dato editado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_cliente:
 *                       type: integer
 *                     estado:
 *                       type: string
 *       400:
 *         description: Faltan datos necesarios para editar
 *       404:
 *         description: El estado no se pudo cambiar
 *       500:
 *         description: Error del servidor
 */

// Ruta para obtener materia prima por nombre



module.exports = router;


module.exports = (io) => {
    router.get('/cliente', authMiddleware, cliente.getAll);
    router.post('/cliente', existsNewClient, authMiddleware, (req, res) => form.insertarCliente(req, res, io));
    router.put('/cliente/:id_cliente/:estado', authMiddleware, (req, res) => cliente.editar(req, res, io));
    return router;
};
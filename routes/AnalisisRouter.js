"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const {get, borrar, agregar} = require('../controllers/AnalisisController.js');
const { authMiddleware } = require("../middleware/authMiddleware");

// DUCUMENTACIÓN SWAGGER

/**
 * @swagger
 * tags:
 *   name: Análisis
 *   description: Endpoints para gestionar análisis sobre los clientes
 */

/**
 * @swagger
 * /analisis/{id_cliente}:
 *   get:
 *     summary: Obtiene los análisis de un cliente.
 *     description: Devuelve todos los análisis realizados para un cliente específico.
 *     tags:
 *       - Análisis
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         description: El ID del cliente para obtener sus análisis.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Análisis encontrados con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_analisis:
 *                         type: integer
 *                         description: El ID del análisis.
 *                         example: 1
 *                       resultado:
 *                         type: string
 *                         description: El resultado del análisis.
 *                         example: "Aprobado"
 *                       fecha:
 *                         type: string
 *                         format: date
 *                         description: La fecha en que se realizó el análisis.
 *                         example: "2025-01-07"
 *       404:
 *         description: No se han realizado análisis para este cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aún no se ha realizado ningún análisis"
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
 * /analisis/{id_analisis}:
 *   delete:
 *     summary: Elimina un análisis por su ID.
 *     description: Borra un análisis específico basado en su ID.
 *     tags:
 *       - Análisis
 *     parameters:
 *       - in: path
 *         name: id_analisis
 *         required: true
 *         description: El ID del análisis que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Análisis eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Análisis borrado con éxito"
 *       404:
 *         description: El análisis no fue encontrado o no se pudo eliminar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: No se ha podido eliminar"
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
 * /analisis:
 *   post:
 *     summary: Crea un nuevo análisis.
 *     description: Permite agregar un nuevo análisis para un cliente específico.
 *     tags:
 *       - Análisis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_analisis:
 *                 type: string
 *                 description: El tipo de análisis que se desea agregar.
 *                 example: "Análisis de sangre"
 *               id_cliente:
 *                 type: integer
 *                 description: El ID del cliente al que se le realizará el análisis.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Análisis creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Análisis creado exitosamente"
 *       404:
 *         description: No se pudo agregar el análisis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El análisis no se pudo agregar"
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
module.exports = (io) => {
    router.get('/analisis/:id_cliente', authMiddleware, get);
    router.delete('/analisis/:id_analisis', borrar);
    router.post('/analisis', authMiddleware, (req, res) => agregar(req, res, io));

    return router;
};
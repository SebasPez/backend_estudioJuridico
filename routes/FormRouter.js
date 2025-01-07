"use strict";
const express = require('express');
const router = express.Router();

//HACEMOS USO DE LOS CONTROLADORES
const {insertarCliente, getDatosJubilatorios, editDatoJubilatorio} = require('../controllers/FormController.js')
const { existsClient } = require('../middleware/existsClient.js');
const { authMiddleware } = require("../middleware/authMiddleware");

// DOCUMENTACIÓN SWAGGER
/**
 * @swagger
 * tags:
 *   name: Formulario
 *   description: Endpoints para gestionar los datos del formulario
 */

/**
 * @swagger
 * /formulario:
 *   post:
 *     summary: Inserta datos de un cliente y los guarda en múltiples tablas relacionadas.
 *     description: Inserta datos de un cliente, datos jubilatorios, y documentos acompañados (si están presentes). Emite un evento en tiempo real con el ID del cliente.
 *     tags:
 *       - Formulario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente.
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 description: Apellido del cliente.
 *                 example: "Pérez"
 *               edad:
 *                 type: integer
 *                 description: Edad del cliente.
 *                 example: 65
 *               documental_acomp:
 *                 type: array
 *                 description: Lista de documentos acompañados.
 *                 items:
 *                   type: string
 *                 example: ["DNI", "Recibo de sueldo"]
 *               otrosDatos:
 *                 type: object
 *                 description: Otros datos relevantes para el cliente.
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Datos insertados exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos insertados exitosamente"
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

/**
 * @swagger
 * /formulario/{id_cliente}:
 *   get:
 *     summary: Obtiene los datos jubilatorios de un cliente.
 *     description: Recupera los datos jubilatorios registrados para el cliente identificado por `id_cliente`.
 *     tags:
 *       - Formulario
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         description: El ID del cliente para obtener sus datos jubilatorios.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Datos jubilatorios encontrados.
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
 *                       id_jubilacion:
 *                         type: integer
 *                         description: El ID de los datos jubilatorios.
 *                       descripcion:
 *                         type: string
 *                         description: Descripción de los datos jubilatorios.
 *                         example: "Pensión por jubilación"
 *       404:
 *         description: No se han encontrado datos jubilatorios para el cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aún no se han registrado datos jubilatorios de dicha persona"
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
 * /formulario/{tabla}/{id}/{atr}/{dato}:
 *   put:
 *     summary: Edita un dato jubilatorio de una tabla específica.
 *     description: Modifica un campo específico de un dato jubilatorio identificado por `id` en una tabla específica.
 *     tags:
 *       - Formulario
 *     parameters:
 *       - in: path
 *         name: tabla
 *         required: true
 *         description: Nombre de la tabla donde se encuentra el dato jubilatorio.
 *         schema:
 *           type: string
 *           example: "datos_jubilatorios"
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del registro que se desea editar.
 *         schema:
 *           type: integer
 *           example: 123
 *       - in: path
 *         name: atr
 *         required: true
 *         description: El atributo del dato jubilatorio que se desea modificar.
 *         schema:
 *           type: string
 *           example: "descripcion"
 *       - in: path
 *         name: dato
 *         required: true
 *         description: El nuevo valor para el atributo especificado.
 *         schema:
 *           type: string
 *           example: "Nueva descripción de jubilación"
 *     responses:
 *       200:
 *         description: Dato editado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dato editado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: El ID del registro editado.
 *                       example: 123
 *                     tabla:
 *                       type: string
 *                       description: El nombre de la tabla editada.
 *                       example: "datos_jubilatorios"
 *                     atr:
 *                       type: string
 *                       description: El atributo editado.
 *                       example: "descripcion"
 *                     dato:
 *                       type: string
 *                       description: El nuevo valor del dato.
 *                       example: "Nueva descripción de jubilación"
 *       400:
 *         description: Faltan datos necesarios para editar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan datos necesarios para editar"
 *       404:
 *         description: No fue posible cambiar el dato.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No fue posible cambiar el dato"
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
    router.post('/formulario', (req, res) => insertarCliente(req, res, io));
    router.get('/formulario/:id_cliente', existsClient, authMiddleware, getDatosJubilatorios);
    router.put('/formulario/:tabla/:id/:atr/:dato', authMiddleware, (req, res) => editDatoJubilatorio(req, res, io));
    
    return router;
};
"use strict";
const express = require('express');
const router = express.Router();

const { register, getAll, deleteUser, updatePass } = require("../controllers/UserController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const { existsAdmin } = require("../middleware/existsAdmin.js");

// DUCUMENTACIÓN SWAGGER

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Registro de un nuevo administrador.
 *     description: Registra un nuevo administrador en el sistema, asegurándose de que las contraseñas coincidan y de que el rol de administrador exista.
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario para el administrador.
 *                 example: admin_user
 *               password:
 *                 type: string
 *                 description: Contraseña del administrador.
 *                 example: Password123!
 *               rePassword:
 *                 type: string
 *                 description: Repetición de la contraseña para verificación.
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Administrador registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Administrador registrado exitosamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       description: ID único del administrador registrado.
 *                       example: 1
 *                     usuario:
 *                       type: string
 *                       description: Nombre de usuario del administrador registrado.
 *                       example: admin_user
 *                     id_rol:
 *                       type: integer
 *                       description: ID del rol asociado al administrador.
 *                       example: 2
 *       404:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Las contraseñas no coinciden.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error en el servidor.
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtiene todos los administradores registrados.
 *     description: Retorna una lista de administradores que tienen asignado el rol de administrador.
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores obtenida exitosamente.
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
 *                       id_usuario:
 *                         type: integer
 *                         description: ID único del administrador.
 *                         example: 1
 *                       nombre_usuario:
 *                         type: string
 *                         description: Nombre de usuario del administrador.
 *                         example: admin_user
 *                       id_rol:
 *                         type: integer
 *                         description: ID del rol asociado al administrador.
 *                         example: 2
 *       404:
 *         description: No se encontraron administradores o el rol de administrador no existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aún no se han registrado administradores."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error de servidor."
 */

/**
 * @swagger
 * /user/{id_usuario}:
 *   delete:
 *     summary: Elimina un administrador por su ID.
 *     description: Borra un administrador existente identificado por su ID.
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del administrador a eliminar.
 *         example: 1
 *     responses:
 *       200:
 *         description: Administrador eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Administrador borrado con éxito"
 *       404:
 *         description: No se pudo encontrar o eliminar al administrador.
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
 * /user/{id}/{pass}:
 *   put:
 *     tags:
 *       - User
 *     summary: Actualizar la contraseña de un usuario
 *     description: Este endpoint permite actualizar la contraseña de un usuario especificado por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del usuario cuya contraseña se desea actualizar
 *         required: true
 *         schema:
 *           type: string
 *       - name: pass
 *         in: path
 *         description: Nueva contraseña del usuario (se encripta automáticamente antes de almacenarse)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente
 *       404:
 *         description: Error al actualizar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la contraseña
 *       500:
 *         description: Error de servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error de servidor
 *     security:
 *       - bearerAuth: []
 */
router.post("/user", authMiddleware, existsAdmin, register);
router.get('/user', authMiddleware, getAll);
router.delete('/user/:id_usuario', authMiddleware, deleteUser);
router.put("/user/:id/:pass", authMiddleware, updatePass);


module.exports = router;
"use strict";
const express = require("express");
const router = express.Router();
const { login, logout, getProtectedData } = require("../controllers/AuthController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { existsUser } = require("../middleware/existsUser");

// DUCUMENTACIÓN SWAGGER

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para manejar la autenticación y autorización
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario y contraseña válidos
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: usuario123
 *               pass:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 *         headers:
 *           Set-Cookie:
 *             description: Cookie con el token de autenticación
 *             schema:
 *               type: string
 *               example: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=86400
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   description: ID único del usuario autenticado
 *                 nombre_usuario:
 *                   type: string
 *                   description: Nombre del usuario autenticado
 *                 rol:
 *                   type: object
 *                   description: Información del rol asociado al usuario
 *                   properties:
 *                     nombre_rol:
 *                       type: string
 *                       description: Nombre del rol del usuario
 *                       example: Administrador
 *                 token:
 *                   type: string
 *                   description: Token JWT generado para la autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNjgyMzkwNDM3LCJleHAiOjE2ODI0NzY4Mzd9.F6HhNGMDeJh8
 *       404:
 *         description: Usuario o contraseña incorrectos o rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario o contraseña incorrectos o rol no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error de servidor
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión y elimina la cookie de autenticación
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada exitosamente
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error de servidor
 */

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Obtiene datos protegidos para usuarios autenticados
 *     tags: [Autenticación]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                     nombre_usuario:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Token inválido o expirado
 */

router.post("/auth/login", existsUser, login);
router.post("/auth/logout", logout);
router.get("/auth/protected", authMiddleware, getProtectedData);

module.exports = router;

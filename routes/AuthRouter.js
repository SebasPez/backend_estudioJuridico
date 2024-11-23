"use strict";
const express = require("express");
const router = express.Router();
const { login, logout, getProtectedData } = require("../controllers/AuthController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { existsUser } = require("../middleware/existsUser");


// Rutas públicas
router.post("/auth/login", existsUser, login);
router.post("/auth/logout", logout);

// Ruta protegida (requiere autenticación)
router.get("/auth/protected", authMiddleware, getProtectedData);

module.exports = router;

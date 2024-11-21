"use strict";
const express = require("express");
const router = express.Router();
const { login, logout, getProtectedData } = require("../controllers/AdminController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { existsUser } = require("../middleware/existsUser");


// Rutas públicas
router.post("/admin/login", existsUser, login);
router.post("/admin/logout", logout);

// Ruta protegida (requiere autenticación)
router.get("/admin/protected", authMiddleware, getProtectedData);

module.exports = router;

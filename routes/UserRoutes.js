"use strict";
const express = require('express');
const router = express.Router();

const { register, getAll, deleteUser } = require("../controllers/UserController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const { existsAdmin } = require("../middleware/existsAdmin.js");


router.post("/user", authMiddleware, existsAdmin, register);
router.get('/user', authMiddleware, getAll);
router.delete('/user/:id_usuario', authMiddleware, deleteUser);


module.exports = router;
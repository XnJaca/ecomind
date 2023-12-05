//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const usuarioController = require("../controllers/usuarioController");

//Rutas
router.get("/", usuarioController.get);
router.get("/clients", usuarioController.getClients);
router.get("/:id", usuarioController.getById);
router.post("/login", usuarioController.login);
router.post("/registrar", usuarioController.register);
router.post("/changePassword", usuarioController.changePassword);

//Exportar
module.exports = router;
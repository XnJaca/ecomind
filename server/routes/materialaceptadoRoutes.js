//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const materialAceptadoController = require("../controllers/materialaceptadoController");

//Rutas
router.get("/", materialAceptadoController.get);

//Exportar
module.exports = router;
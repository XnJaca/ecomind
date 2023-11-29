//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const cuponCanjeController = require("../controllers/cuponcanjeController");

//Rutas
router.get("/", cuponCanjeController.get);
router.get("/:id", cuponCanjeController.getById);

//Exportar
module.exports = router;
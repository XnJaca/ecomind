//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const canjeCuponController = require("../controllers/canjecuponController");

//Rutas
router.get("/", canjeCuponController.get);
router.get("/:id", canjeCuponController.getById);

//Exportar
module.exports = router;
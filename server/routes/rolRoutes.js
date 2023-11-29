
//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const rolController = require("../controllers/rolController");

//Rutas
router.get("/", rolController.get);
router.get("/:id", rolController.getById);

//Exportar
module.exports = router;
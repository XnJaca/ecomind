//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const materialReciclabeController = require("../controllers/materialreciclableController");

//Rutas
router.get("/", materialReciclabeController.get);
router.post("/", materialReciclabeController.create);
router.put("/:id", materialReciclabeController.update);
router.get("/:id", materialReciclabeController.getById);

//Exportar
module.exports = router;
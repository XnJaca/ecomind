//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const centroAcopioController = require("../controllers/centroacopioController");

//Rutas
router.get("/", centroAcopioController.get);
router.post("/", centroAcopioController.createCentroAcopio);
router.get("/:id", centroAcopioController.getById);
router.put("/:id", centroAcopioController.updateCentroAcopio);
router.get("/administrador/:id", centroAcopioController.getCentrosAcopioByAdministrador);

//Exportar
module.exports = router;
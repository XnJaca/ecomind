//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const canjeMaterialController = require("../controllers/canjematerialController");

//Rutas
router.get("/", canjeMaterialController.get);
router.get("/:id", canjeMaterialController.getById);
router.get("/centroAcopio/:id", canjeMaterialController.getByCentroAcopio);
router.get("/cliente/:id", canjeMaterialController.getByCliente);
router.post("/", canjeMaterialController.createCanjeMaterial);

//Exportar
module.exports = router;
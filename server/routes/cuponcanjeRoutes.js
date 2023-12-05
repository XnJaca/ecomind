//Express para agregar las rutas
const express = require("express");
const router = express.Router();

//Controlador
const cuponCanjeController = require("../controllers/cuponcanjeController");

//Rutas
router.get("/", cuponCanjeController.get);
router.get("/getValids", cuponCanjeController.getValids);
router.get("/:id", cuponCanjeController.getById);
router.post("/", cuponCanjeController.create);
router.put("/:id", cuponCanjeController.update);
router.post("/canjearCupon", cuponCanjeController.canjearCupon);
router.get("/getByUser/:id", cuponCanjeController.getByUser);

//Exportar
module.exports = router;
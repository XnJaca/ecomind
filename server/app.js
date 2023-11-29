const dotEnv = require("dotenv");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const prism = new PrismaClient();

//---Archivos de rutas---
const rol = require("./routes/rolRoutes");
const usuario = require("./routes/usuarioRoutes");
const centroAcopioRoutes = require("./routes/centroacopioRoutes");
const materialReciclable = require("./routes/materialreciclableRoutes");
const materialAcepetado = require("./routes/materialaceptadoRoutes");
const canjeMaterial = require("./routes/canjematerialRoutes");
const cuponCanje = require("./routes/cuponcanjeRoutes");
const canjeCupon = require("./routes/canjecuponRoutes");

// Acceder a la configuracion del archivo .env
dotEnv.config();

// Puero que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;

// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());

// Middleware para loggear las llamadas al servidor
app.use(logger("dev"));

// Middleware para gestionar Requests y Response json
app.use(express.json({ limit: '40mb' })); // Ajusta el límite según tus necesidades
app.use(
  express.urlencoded({
    extended: true,
    limit: '40mb', // Ajusta el límite según tus necesidades
  })
);

//---- Definir rutas ---- 
app.use("/rol", rol);
app.use("/usuario", usuario);
app.use("/centroacopio", centroAcopioRoutes);
app.use("/materialreciclable", materialReciclable);
app.use("/materialaceptado", materialAcepetado);
app.use("/canjematerial", canjeMaterial);
app.use("/cuponcanje", cuponCanje);
app.use("/canjecupon", canjeCupon);
 
// Servidor
app.listen(port, () => { 
  console.log(`http://localhost:${port}`);
  console.log("Presione CTRL-C para deternerlo\n");
});

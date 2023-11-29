const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const materialReciclables = await prisma.materialReciclable.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  materialReciclables.forEach((element) => {
    try {
      const url = path.join(__dirname, "../uploads", `${element.imagenURL}`);
      if (fs.existsSync(url)) {
        const img = fs.readFileSync(url);
        element.image = img.toString("base64");
      }
    } catch (error) {
      console.log(error);
      element.image = null;
    }
  });
  response.json(materialReciclables);
};

module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const materialReciclable = await prisma.materialReciclable.findUnique({
    where: {
      id: id,
    },
  });
  const url = path.join(__dirname, "../uploads", `${materialReciclable.imagenURL}`);
  if (fs.existsSync(url)) {
    const img = fs.readFileSync(url);
    materialReciclable.image = img.toString("base64");
  }else{
    materialReciclable.image = null;
  }
  response.json(materialReciclable);
};

// Create
module.exports.create = async (request, response, next) => {
  let data = request.body;
  const materialReciclable = await prisma.materialReciclable.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioEcoMoneda: parseFloat(data.precioEcoMoneda),
      imagenURL: data.imagenURL,
      colorRepresentativo: data.colorRepresentativo,
      unidadMedida: data.unidadMedida,
    },
  });
  // Guardar image dentro de la carpeta uploads/imagenURL
  const binaryData = Buffer.from(data.image, "base64");
  const imagePath = path.join(__dirname, "../uploads", `${data.imagenURL}`);
  console.log(imagePath);
  fs.writeFile(imagePath, binaryData, "binary", (err) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: "Error al guardar la imagen" });
    }
  });
  response.json(materialReciclable);
};

// Update
module.exports.update = async (request, response, next) => {
  let data = request.body;
  
  // Obten el materialReciclable actual antes de la actualización
  const existingMaterialReciclable = await prisma.materialReciclable.findUnique({
    where: {
      id: parseInt(data.id),
    },
  });

  if (!existingMaterialReciclable) {
    return response.status(404).json({ error: "Material reciclable no encontrado" });
  }

  // Actualiza los campos del materialReciclable
  const newMaterialReciclable = await prisma.materialReciclable.update({
    where: {
      id: parseInt(data.id),
    },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioEcoMoneda: parseFloat(data.precioEcoMoneda),
      imagenURL: data.imagenURL,
      colorRepresentativo: data.colorRepresentativo,
      unidadMedida: data.unidadMedida,
    },
  });

  // Guarda la nueva imagen solo si ha cambiado
  if (data.image && data.image !== existingMaterialReciclable.image) {
    const base64Data = data.image.split(",")[0]; // Elimina el encabezado "data:image/png;base64,"
    const binaryData = Buffer.from(base64Data, "base64");
    const imagePath = path.join(__dirname, "../uploads", `${data.imagenURL}`);
    
    fs.writeFile(imagePath, binaryData, "binary", (err) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error al guardar la nueva imagen" });
      }
    });
  }

  response.json(newMaterialReciclable);
};


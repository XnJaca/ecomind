const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const cuponCanjes = await prisma.cuponCanje.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  cuponCanjes.forEach((element) => {
    try {
      const imagePath = path.join(__dirname, "../uploads", `${element.imagenURL}`);

      if (fs.existsSync(imagePath)) {
        const img = fs.readFileSync(imagePath);
        element.image = img.toString("base64");
      }
    } catch (error) {
      console.log(error);
      element.image = null;
    }
  });

  response.json(cuponCanjes);
};


module.exports.getValids = async (request, response, next) => {
  const cuponCanjes = await prisma.cuponCanje.findMany({
    where: {
      fechaFinal: {
        gte: new Date(), // Filtrar por fecha de vencimiento mayor o igual a la fecha actual
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });

  cuponCanjes.forEach((element) => {
    try {
      const imagePath = path.join(__dirname, "../uploads", `${element.imagenURL}`);

      if (fs.existsSync(imagePath)) {
        const img = fs.readFileSync(imagePath);
        element.image = img.toString("base64");
      }
    } catch (error) {
      console.log(error);
      element.image = null;
    }
  });

  response.json(cuponCanjes);
};

module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const cuponCanje = await prisma.cuponCanje.findUnique({
    where: {
      id: id,
    }
  });
  
  const imagePath = path.join(__dirname, "../uploads", `${cuponCanje.imagenURL}`);

  if (fs.existsSync(imagePath)) {
    const img = fs.readFileSync(imagePath);
    cuponCanje.image = img.toString("base64");
  }else{
    cuponCanje.image = null;
  }

  response.json(cuponCanje);
};

module.exports.getByUser = async (request, response, next) => {
  let id = request.params.id;
  console.log("id: " + id);
  const cuponCanjes = await prisma.cuponCanje.findMany({
    where: {
      canjeCupon: {
        some: {
          usuarioId: id
        }
      }
    }
  });

  cuponCanjes.forEach((element) => {
    try {
      const imagePath = path.join(__dirname, "../uploads", `${element.imagenURL}`);

      if (fs.existsSync(imagePath)) {
        const img = fs.readFileSync(imagePath);
        element.image = img.toString("base64");
      }
    } catch (error) {
      console.log(error);
      element.image = null;
    }
  });

  response.json(cuponCanjes);
};

module.exports.create = async (request, response, next) => {

  let data = request.body;
  const materialReciclable = await prisma.cuponCanje.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagenURL: data.imagenURL,
      categoria: data.categoria,
      fechaInicio: data.fechaInicio,
      fechaFinal: data.fechaFinal,
      ecoMonedasNecesarias: data.ecoMonedasNecesarias
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
}

module.exports.update = async (request, response, next) => {
  let data = request.body;
  let id = parseInt(request.params.id);

  const existingCuponCanje = await prisma.cuponCanje.findUnique({
    where: { id: id },
  });

  if (!existingCuponCanje) {
    return response
      .status(400)
      .json({ error: "No se encontró el cupón de canje" });
  }

  const cuponCanje = await prisma.cuponCanje.update({
    where: { id: id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagenURL: data.imagenURL,
      categoria: data.categoria,
      fechaInicio: data.fechaInicio,
      fechaFinal: data.fechaFinal,
      ecoMonedasNecesarias: data.ecoMonedasNecesarias
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

  response.json(cuponCanje);
};

// model CanjeCupon{
//   id     Int  @id @default(autoincrement())
//   // Relación con la tabla de usuario
//   usuarioId   String
//   usuario     Usuario     @relation(fields: [usuarioId], references: [id])
//   // Relación con la tabla de cupón de canje
//   cuponCanjeId   Int
//   cuponCanje     CuponCanje     @relation(fields: [cuponCanjeId], references: [id])
//   fechaCanje DateTime @default(now())
// }

module.exports.canjearCupon = async (request, response, next) => {

  let data = request.body;

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: data.usuarioId,
    },
    include: {
      canjeCupon: {
        select: {
          cuponCanjeId: true,
        }
      }
    }
  });

  const cuponCanje = await prisma.cuponCanje.findUnique({
    where: {
      id: data.cuponCanjeId,
    }
  });

  if (usuario.ecoMonedas < cuponCanje.ecoMonedasNecesarias) {
    const msj = "No tiene suficientes eco monedas para canjear el cupón\nTienes: " + usuario.ecoMonedas + " eco monedas y necesitas: " + cuponCanje.ecoMonedasNecesarias + " eco monedas";
    return response.status(400).json({ error: msj });
  }

  const canjeCupon = await prisma.canjeCupon.create({
    data: {
      usuarioId: data.usuarioId,
      cuponCanjeId: data.cuponCanjeId,
      fechaCanje: new Date()
    }
  });

  if (!canjeCupon) {
    return response.status(400).json({ error: "Error al canjear el cupón" });
  }

  await prisma.usuario.update({
    where: { id: data.usuarioId },
    data: {
      ecoMonedas: usuario.ecoMonedas - cuponCanje.ecoMonedasNecesarias
    },
  });

  response.json({
    message: "Cupón canjeado exitosamente!\nMonedas restantes: " + (usuario.ecoMonedas - cuponCanje.ecoMonedasNecesarias),
    data: {
      canjeCupon: canjeCupon,
      monedas: usuario.ecoMonedas - cuponCanje.ecoMonedasNecesarias
    }
  });
}
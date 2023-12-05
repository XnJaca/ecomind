const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const canjeMateriales = await prisma.canjeMaterial.findMany({
    orderBy: {
      usuarioId: "asc",
    },
  });
  response.json(canjeMateriales);
};

module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const canjeMaterial = await prisma.canjeMaterial.findUnique({
    where: {
      id: id,
    },
    include: {
      centroAcopio: true,
      usuario: true,
      detalleCanjeMaterial: {
        select: {
          materialReciclable: true,
          cantidad: true,
          subtotal: true,
        }
      }
    },
  });
  response.json(canjeMaterial);
};

module.exports.getByCentroAcopio = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const canjeMaterial = await prisma.canjeMaterial.findMany({
    where: {
      centroAcopioId: id,
    },
    include: {
      centroAcopio: true,
      usuario: true,
      detalleCanjeMaterial: {
        select: {
          materialReciclable: true,
          cantidad: true,
          subtotal: true,
        }
      }
    },
  });
  response.json(canjeMaterial);
};

module.exports.getByCliente = async (request, response, next) => {
  let id = (request.params.id);
  const canjeMaterial = await prisma.canjeMaterial.findMany({
    where: {
      usuarioId: id,
    },
    include: {
      usuario: true,
      centroAcopio: true,
      detalleCanjeMaterial: {
        select: {
          materialReciclable: true,
          cantidad: true,
          subtotal: true,
        }
      }
    },
  });
  response.json(canjeMaterial);
};


// model MaterialAceptado{
//   // Relación con la tabla de centro de acopio
//   centroAcopioId   Int
//   centroAcopio     CentroAcopio     @relation(fields: [centroAcopioId], references: [id])
//   // Relación con la tabla de material reciclable
//   materialReciclableId   Int
//   materialReciclable     MaterialReciclable     @relation(fields: [materialReciclableId], references: [id])
//   // Definición de la llave primaria compuesta
//   @@id([centroAcopioId, materialReciclableId])
// }

module.exports.createCanjeMaterial = async (request, response, next) => {
  const { usuarioId, centroAcopioId, total, detalleCanjeMaterial } = request.body;
  console.log(request.body);
  try {
    // Iniciamos la transacción

    //Ejemplo detalleCanjeMaterial
    // detalleCanjeMaterial: [
    //   {
    //     canjeMaterialId: null,
    //     materialReciclableId: 1,
    //     cantidad: 5,
    //     subtotal: 40
    //   }
    // ]

    //Validar que los materiales en detalleCanjeMaterial, sean aceptados por el centro de acopio
    const materialesAceptados = await prisma.materialAceptado.findMany({
      where: {
        centroAcopioId: centroAcopioId,
      },
      select: {
        materialReciclableId: true,
      },
    });

    const materialesAceptadosIds = materialesAceptados.map((item) => item.materialReciclableId);

    const materialesNoAceptados = detalleCanjeMaterial.filter((item) => !materialesAceptadosIds.includes(item.materialReciclableId));

    //BUscar los materiales que no acepta el centro de acopio en la tabla de material reciclable

    const materialesNoAceptadosNombres = await prisma.materialReciclable.findMany({
      where: {
        id: {
          in: materialesNoAceptados.map((item) => item.materialReciclableId),
        },
      },
      select: {
        nombre: true,
      },
    });


    if (materialesNoAceptados.length > 0) {
      response.status(400).json({ message: `El centro de acopio no acepta los siguientes materiales: ${materialesNoAceptadosNombres.map((item) => item.nombre).join(', ')}` });
      return;
    }

    await prisma.canjeMaterial.create({
      data: {
        usuarioId: usuarioId.id,
        centroAcopioId,
        total,
        detalleCanjeMaterial: {
          create: detalleCanjeMaterial.map((item) => ({
            materialReciclableId: item.materialReciclableId,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        centroAcopio: true,
        detalleCanjeMaterial: {
          select: {
            materialReciclable: true,
            cantidad: true,
            subtotal: true,
          },
        },
      },
    });

   const user = await prisma.usuario.findUnique({
      where: {
        id: usuarioId.id,
      },
    });

    const ecoMonedas = user.ecoMonedas + total;

    await prisma.usuario.update({
      where: {
        id: usuarioId.id,
      },
      data: {
        ecoMonedas,
      },
    });

    response.json({ message: 'CanjeMaterial creado exitosamente.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
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

module.exports.createCanjeMaterial = async (request, response, next) => {
  const { usuarioId, centroAcopioId, total, detalleCanjeMaterial } = request.body;

  try {
    // Iniciamos la transacción
    await prisma.$transaction([
      // Crear el CanjeMaterial con el detalle
      prisma.canjeMaterial.create({
        data: {
          usuarioId,
          centroAcopioId,
          total,
          detalleCanjeMaterial: {
            create: detalleCanjeMaterial.map(item => ({
              materialReciclableId: item.materialReciclableId,
              cantidad: item.cantidad,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          centroAcopio: true,
          usuario: true,
          detalleCanjeMaterial: {
            select: {
              materialReciclable: true,
              cantidad: true,
              subtotal: true,
            },
          },
        },
      }),
    ]);

    response.json({ message: 'CanjeMaterial creado exitosamente.' });
  } catch (error) {
    console.log(error);
    // En caso de error, deshacer la transacción
    await prisma.$rollback();
    next(error);
  }
};
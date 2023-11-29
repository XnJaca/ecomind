const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
    const materialAceptados = await prisma.materialAceptado.findMany({
      orderBy: {
        centroAcopioId: "asc",
      },
    });
    response.json(materialAceptados);
  };

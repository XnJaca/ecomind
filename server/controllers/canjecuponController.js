const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
    const canjeCupones = await prisma.canjeCupon.findMany({
      orderBy: {
        usuarioId : "asc",
      },
    });
    response.json(canjeCupones);
  };
  
  module.exports.getById = async (request, response, next) => {
    let id = parseInt(request.params.id);
    const canjeCupon = await prisma.canjeCupon.findUnique({
      where: { id: id,}
    });
    response.json(canjeCupon);
  };
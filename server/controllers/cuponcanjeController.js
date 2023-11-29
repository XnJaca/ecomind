const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
    const cuponCanjes = await prisma.cuponCanje.findMany({
      orderBy: {
        nombre: "asc",
      },
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
    response.json(cuponCanje);
  };
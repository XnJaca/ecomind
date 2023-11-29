const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
    const roles = await prisma.rol.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
    response.json(roles);
  };
  
  module.exports.getById = async (request, response, next) => {
    let id = parseInt(request.params.id);
    const rol = await prisma.rol.findUnique({
      where: {
        id: id,
      }
    });
    response.json(rol);
  };
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const centroAcopios = await prisma.centroAcopio.findMany({
    orderBy: {
      nombre: "asc",
    },
    include: {
      administrador: true,
      materialAceptado: {
        select: {
          materialReciclable: true,
        },
      },
      canjeMaterial: {
        select: {
          usuarioId: true,
          fechaCanje: true,
          total: true,
          fechaCanje: true,
          total: true,
          detalleCanjeMaterial: {
            select: {
              materialReciclable: true,
              cantidad: true,
              subtotal: true,
            },
          },
        },
      },
    },
  });
  response.json(centroAcopios);
};

module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const centroAcopio = await prisma.centroAcopio.findUnique({
    where: {
      id: id,
    },
    include: {
      administrador: true,
      materialAceptado: {
        select: {
          materialReciclable: true,
        },
      },
      canjeMaterial: {
        select: {
          usuarioId: true,
          fechaCanje: true,
          total: true,
          fechaCanje: true,
          total: true,
          detalleCanjeMaterial: {
            select: {
              materialReciclable: true,
              cantidad: true,
              subtotal: true,
            },
          },
        },
      },
    },
  });
  response.json(centroAcopio);
};

module.exports.getCentrosAcopioByAdministrador = async (
  request,
  response,
  next
) => {
  try {
    let id = request.params.id;
    const centroAcopio = await prisma.centroAcopio.findMany({
      where: {
        administradorId: id,
      },
      select: {
        id: true,
        nombre: true,
        direccionProvincia: true,
        direccionCanton: true,
        direccionDistrito: true,
        direccionExacta: true,
        telefono: true,
        horarioAtencion: true,
        administradorId: true,
        administrador: true,
        materialAceptado: {
          select: {
            materialReciclable: true,
          },
        },
      },
    });
    response.json(centroAcopio);
  } catch (error) {
    console.error("Error al obtener centros de acopio por usuario:", error);
    response.status(500).json({ error: "Error interno del servidor" });
  }
};

// Create
module.exports.createCentroAcopio = async (request, response, next) => {
  try {
    let data = request.body;

    // Crea el centro de acopio junto con los materiales aceptados
    const centroAcopio = await prisma.centroAcopio.create({
      data: {
        nombre: data.nombre,
        direccionProvincia: data.direccionProvincia,
        direccionCanton: data.direccionCanton,
        direccionDistrito: data.direccionDistrito,
        direccionExacta: data.direccionExacta,
        telefono: data.telefono,
        horarioAtencion: data.horarioAtencion,
        habilitado: data.habilitado,
        administradorId: data.administradorId,
        // Crear relación con materiales aceptados
        materialAceptado: {
          create: data.materialAceptado.map((material) => ({
            materialReciclableId: material.materialReciclableId,
          })),
        },
      },
      // Incluir materiales aceptados en la respuesta
      include: {
        materialAceptado: {
          include: {
            materialReciclable: true,
          },
        },
      },
    });

    response.json(centroAcopio);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Error al crear el Centro de Acopio" });
  }
};

// Update
module.exports.updateCentroAcopio = async (request, response, next) => {
  try {
    let data = request.body;
    let id = parseInt(request.params.id);

    // Obten el centroAcopio actual antes de la actualización
    const existingCentroAcopio = await prisma.centroAcopio.findUnique({
      where: { id: id },
      include: {
        materialAceptado: {
          select: {
            materialReciclableId: true,
          },
        },
      },
    });

    if (!existingCentroAcopio) {
      return response
        .status(404)
        .json({ error: "Centro de Acopio no encontrado" });
    }

    // Eliminar todas las relaciones existentes
    await prisma.materialAceptado.deleteMany({
      where: {
        centroAcopioId: id,
      },
    });

    // Crear nuevas relaciones basadas en los datos proporcionados
    await prisma.materialAceptado.createMany({
      data: data.materialAceptado.map((material) => ({
        centroAcopioId: id,
        materialReciclableId: material.materialReciclableId,
      })),
    });

    // Actualizar otros campos del centroAcopio si es necesario
    const newCentroAcopio = await prisma.centroAcopio.update({
      where: {
        id: id,
      },
      data: {
        nombre: data.nombre,
        direccionProvincia: data.direccionProvincia,
        direccionCanton: data.direccionCanton,
        direccionDistrito: data.direccionDistrito,
        direccionExacta: data.direccionExacta,
        telefono: data.telefono,
        horarioAtencion: data.horarioAtencion,
        habilitado: data.habilitado,
        administradorId: data.administradorId,
      },
    });

    response.json(newCentroAcopio);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error: "Error al actualizar el Centro de Acopio" });
  }
};
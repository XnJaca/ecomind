const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      nombreCompleto: "asc",
    },
    where: {
      rolId: 1,
    },
  });
  response.json(usuarios);
};

module.exports.getClients = async (request, response, next) => {
  const usuarios = await prisma.usuario.findMany({
    where: {
      rolId: 2,
    },
    orderBy: {
      nombreCompleto: "asc",
    },
  });
  response.json(usuarios);
}


module.exports.getById = async (request, response, next) => {
  let id = (request.params.id);
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: id,
    },
    include: {
      rol: true,
      centroAcopio: {
        select: {
          nombre: true,
        }
      },
      canjeMaterial: {
        select: {
          fechaCanje: true,
          total: true,
          detalleCanjeMaterial: {
            select: {
              materialReciclable: true,
              cantidad: true,
              subtotal: true,
            }
          }
        }
      },
      canjeCupon: {
        select: {
          cuponCanje: {
            select: {
              nombre: true,
              descripcion: true,
              ecoMonedasNecesarias: true
            }
          },
          fechaCanje: true,
        }
      }
    }
  });
  response.json(usuario);
};

module.exports.login = async (request, response, next) => {
  let userReq = request.body;

  const usuario = await prisma.usuario.findUnique({
    where: {
      correo: userReq.email,
    },
    include: {
      rol: true,
      centroAcopio: true,
      canjeMaterial: {
        select: {
          fechaCanje: true,
          total: true,
          detalleCanjeMaterial: {
            select: {
              materialReciclable: true,
              cantidad: true,
              subtotal: true,
            }
          }
        }
      },
      canjeCupon: {
        select: {
          cuponCanje: {
            select: {
              nombre: true,
              descripcion: true,
              ecoMonedasNecesarias: true
            }
          },
          fechaCanje: true,
        }
      }
    }
  });

  if (!usuario) {
    return response.status(401).send({
      succes: false,
      error: "El usuario no se encuentra registrado",
    });
  }

  console.log("USER", usuario);

  // const checkPassword = await bcrypt.compare(userReq.password, usuario.contrasena);
  const checkPassword = userReq.password === usuario.contrasena;
  if (checkPassword === false) {
    return response.status(401).send({
      succes: false,
      error: "La contraseña es incorrecta",
    });
  } else {

    console.log(usuario);

    //Obtener todos los cupones del usuario
    const cupones = await prisma.canjeCupon.findMany({
      where: {
        usuarioId: usuario.id,
      },
      include: {
        cuponCanje: true
      }
    });

    const canjesMaterial = await prisma.canjeMaterial.findMany({
      where: {
        centroAcopioId: usuario.centroAcopio[0].id,
      },
      include: {
        detalleCanjeMaterial: {
          select: {
            subtotal: true,
          },
        },
      },
    });

    const totalEcoMonedasMaterial = canjesMaterial.reduce((total, canje) => {
      return total + canje.detalleCanjeMaterial.reduce((subtotal, detalle) => {
        return subtotal + detalle.subtotal;
      }, 0);
    }, 0);

    console.log("Total ecoMonedas por canje de material:", totalEcoMonedasMaterial);


    const totalEcoMonedasCupones = cupones.reduce((total, cupon) => {
      return total + cupon.cuponCanje.ecoMonedasNecesarias;
    }, 0);

    console.log("Total ecoMonedas canjeadas por cupones:", totalEcoMonedasCupones);

    //Muestra la Cantidad de canjes de materiales realizados en el mes actual
    const currentDate = new Date();
    // Obtener el mes y el año actual
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filtrar los canjes de material realizados en el mes actual
    const canjesMaterialMesActual = canjesMaterial.filter(canje => {
      const fechaCanje = new Date(canje.fechaCanje);
      const canjeMonth = fechaCanje.getMonth();
      const canjeYear = fechaCanje.getFullYear();
      return canjeMonth === currentMonth && canjeYear === currentYear;
    });

    // Obtener la cantidad de canjes de material realizados en el mes actual
    const cantidadCanjesMes = canjesMaterialMesActual.length;

    console.log("Cantidad de canjes de material en el mes actual:", cantidadCanjesMes);

    //TODO: Obtener la cantidad total de monedas generadas por centro de acopio
    const totalEcoMonedasCentroAcopio = await usuario.centroAcopio.reduce(async (total, centro) => {
      // Obtener todos los canjes de material del centro de acopio
      const canjesMaterialCentro = await prisma.canjeMaterial.findMany({
        where: {
          centroAcopioId: centro.id,
        },
        include: {
          detalleCanjeMaterial: {
            select: {
              subtotal: true,
            },
          },
        },
      });

      // Calcular la suma de ecoMonedas generadas por los canjes de material en el centro de acopio
      const totalEcoMonedasCentro = canjesMaterialCentro.reduce((subtotal, canje) => {
        return subtotal + canje.detalleCanjeMaterial.reduce((detalleSubtotal, detalle) => {
          return detalleSubtotal + detalle.subtotal;
        }, 0);
      }, 0);

      // Imprimir la cantidad de ecoMonedas generadas por el centro de acopio
      console.log(`Total ecoMonedas generadas por ${centro.nombre}:`, totalEcoMonedasCentro);

      // Sumar al total general
      return total + totalEcoMonedasCentro;
    }, 0);

    const payload = {
      id: usuario.id,
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.correo,
      role: usuario.rol,
      ecoMonedas: usuario.ecoMonedas,
      ecoMonedasRecibidas: totalEcoMonedasMaterial,
      ecoMonedasCanjeadas: totalEcoMonedasCupones,
      totalEcoMonedasCentroAcopio,
      cantidadCanjesMes: cantidadCanjesMes,
      centroAcopio: usuario.centroAcopio.length ? {
        id: usuario.centroAcopio[0].id,
        nombre: usuario.centroAcopio[0].nombre
      } : null,
    }

    console.log(payload);

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE
    });

    response.json({
      success: true,
      message: "Ingreso exitoso",
      token,

    })
  }
}

module.exports.register = async (request, response, next) => {
  try {
    const clientData = request.body; // Assuming client data is sent in the request body

    console.log(clientData);
    // Validate and process clientData as needed

    // const hashedPassword = await bcrypt.hash(clientData.password, 10); // Hash the password

    // Create a new client in the database
    const newClient = await prisma.usuario.create({
      data: {
        id: clientData.identificacion,
        correo: clientData.email,
        nombreCompleto: clientData.nombre,
        direccionProvincia: clientData.direccionProvincia,
        direccionCanton: clientData.direccionCanton,
        direccionDistrito: clientData.direccionDistrito,
        direccionExacta: clientData.direccionExacta,
        telefono: clientData.telefono,
        contrasena: clientData.password,
        rolId: request.rolId ?? 2,
        // centroAcopioId: clientData.centroAcopioId,
      },
    });

    response.json({
      success: true,
      message: "Registro exitoso",
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      error: "Error al registrar el cliente",
    });
  }
}


module.exports.changePassword = async (request, response, next) => {
  try {
    const clientData = request.body; // Assuming client data is sent in the request body

    console.log("CHANGE PASSWORD", clientData);
    // Validate and process clientData as needed

    // const hashedPassword = await bcrypt.hash(clientData.password, 10); // Hash the password

    // Create a new client in the database
    const newClient = await prisma.usuario.update({
      where: {
        id: clientData.id
      },
      data: {
        contrasena: clientData.password,
      },
    });

    response.json({
      success: true,
      message: "Contraseña cambiada exitosamente",
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      error: "Error al cambiar la contraseña",
    });
  }
}

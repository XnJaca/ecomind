const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

module.exports.get = async (request, response, next) => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      nombreCompleto: "asc",
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
      centroAcopio:true,
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
    response.status(401).send({
      succes: false,
      error: "El usuario no se encuentra registrado",
    });
  }

  // const checkPassword = await bcrypt.compare(userReq.password, usuario.contrasena);
  const checkPassword = userReq.password === usuario.contrasena;
  if (checkPassword === false) {
    response.status(401).send({
      succes: false,
      error: "La contraseña es incorrecta",
    });
  } else {

    console.log(usuario);
    const payload = {
      id: usuario.id,
      email: usuario.correo,
      role: usuario.rol,
      centroAcopio: usuario.centroAcopio[0].id,
    }

    console.log(payload);

    const token= jwt.sign(payload,process.env.SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRE
    });

    response.json({
      success: true,
      message: "Usuario registrado",
      token,
        
    })
  }

}

// Para crear el seed para crear los datos de prueba
// Create many se puede usar sólo para los modelos que no tengan relaciones con otros modelos

// Esto es para darle formato a los datos que se van a crear
import { PrismaClient } from '@prisma/client';
import { Rol } from './seeds/Rol';
import { MaterialReciclable } from './seeds/MaterialReciclable';
// Se importan los datos que se van a crear

// Instancia para poder hacer consultas a la base de datos, por medio del cliente de prisma
const prisma = new PrismaClient();

async function main() {
    // Inserción de datos
    // Insertar roles
    await prisma.rol.createMany({
        data: Rol,
    });

    // Insertar usuario

    // 1
    await prisma.usuario.create({
        data: {
            id: "208440295",
            correo: "murillosteven65@gmail.com",
            nombreCompleto: "Steven Murillo",
            direccionProvincia: "Alajuela",
            direccionCanton: "Alajuela",
            direccionDistrito: "San Antonio",
            direccionExacta: "Calle Romo",
            telefono: "64080371",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 1
                }
            }
        }
    });

    // 2
    await prisma.usuario.create({
        data: {
            id: "208080999",
            correo: "amurillo2800@gmail.com",
            nombreCompleto: "Andrea Murillo",
            direccionProvincia: "Heredia",
            direccionCanton: "Heredia",
            direccionDistrito: "San Antonio de Belén",
            direccionExacta: "La Ribera",
            telefono: "88888888",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 1
                }
            }
        }
    });

    // 3
    await prisma.usuario.create({
        data: {
            id: "208350256",
            correo: "mavindas@gmail.com",
            nombreCompleto: "Mario Vindas",
            direccionProvincia: "San José",
            direccionCanton: "Central",
            direccionDistrito: "Merced",
            direccionExacta: "Calle 1",
            telefono: "88888888",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 1
                }
            }
        }
    });

    // 4
    await prisma.usuario.create({
        data: {
            id: "80101028",
            correo: "joaquinari@gmail.com",
            nombreCompleto: "Joaquina Rivera",
            direccionProvincia: "Heredia",
            direccionCanton: "Central",
            direccionDistrito: "Heredia",
            direccionExacta: "Calle 22",
            telefono: "88888888",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 2
                }
            }
        }
    });

    // 5
    await prisma.usuario.create({
        data: {
            id: "204930861",
            correo: "juanesc@gmail.com",
            nombreCompleto: "Juan Escalante",
            direccionProvincia: "Alajuela",
            direccionCanton: "Central",
            direccionDistrito: "San José",
            direccionExacta: "Calle San Juan",
            telefono: "88888888",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 2
                }
            }
        }
    });

    // 6
    await prisma.usuario.create({
        data: {
            id: "408620154",
            correo: "joseled@gmail.com",
            nombreCompleto: "Jose Ledezma",
            direccionProvincia: "Heredia",
            direccionCanton: "Belén",
            direccionDistrito: "San Antonio",
            direccionExacta: "Calle 1",
            telefono: "88888888",
            contrasena: "123456",
            rol: {
                connect: {
                    id: 1
                }
            }
        }
    });

    // Insertar Centro de acopio

    // 1
    await prisma.centroAcopio.create({
        data: {
            nombre: "Cifuentes",
            direccionProvincia: "Heredia",
            direccionCanton: "Barva",
            direccionDistrito: "Barva",
            direccionExacta: "Calle Romo",
            telefono: "24453212",
            horarioAtencion: "Lunes a Viernes de 8am a 5pm",
            habilitado: true,
            administrador: {
                connect: {
                    id: "208440295"
                }
            }
        }
    });

    // 2
    await prisma.centroAcopio.create({
        data: {
            nombre: "San José",
            direccionProvincia: "San José",
            direccionCanton: "San José",
            direccionDistrito: "Carmen",
            direccionExacta: "Avenida Central",
            telefono: "24589562",
            horarioAtencion: "Lunes a Sábado de 9am a 6pm",
            habilitado: true,
            administrador: {
                connect: {
                    id: "408620154"
                }
            }
        }
    });
    
    // 3
    await prisma.centroAcopio.create({
        data: {
            nombre: "Alajuela",
            direccionProvincia: "Alajuela",
            direccionCanton: "Alajuela",
            direccionDistrito: "Alajuela",
            direccionExacta: "Avenida Segunda",
            telefono: "23584874",
            horarioAtencion: "Lunes a Viernes de 7am a 4pm",
            habilitado: true,
            administrador: {
                connect: {
                    id: "208350256"
                }
            }
        }
    });
    


    // Insertar Material Reciclable

    await prisma.materialReciclable.createMany({
        data: MaterialReciclable,
    });


    // Insertar Material Aceptado
    // 1
    await prisma.materialAceptado.create({
        data: {
            centroAcopio: {
                connect: {
                    id: 1
                }
            },
            materialReciclable: {
                connect: {
                    id: 1
                }
            }
        }
    });
    // 2
    await prisma.materialAceptado.create({
        data: {
            centroAcopio: {
                connect: {
                    id: 1
                }
            },
            materialReciclable: {
                connect: {
                    id: 2
                }
            }
        }
    });

    // 3
    await prisma.materialAceptado.create({
        data: {
            centroAcopio: {
                connect: {
                    id: 2
                }
            },
            materialReciclable: {
                connect: {
                    id: 3
                }
            }
        }
    });

    // 4
    await prisma.materialAceptado.create({
        data: {
            centroAcopio: {
                connect: {
                    id: 3
                }
            },
            materialReciclable: {
                connect: {
                    id: 2
                }
            }
        }
    });
    // 5
    await prisma.materialAceptado.create({
        data: {
            centroAcopio: {
                connect: {
                    id: 3
                }
            },
            materialReciclable: {
                connect: {
                    id: 3
                }
            }
        }
    });



    // Insertar CanjeMaterial
    // 1
    await prisma.canjeMaterial.create({
        data: {
            usuario: {
                connect: {
                    id: "204930861"
                }
            },
            centroAcopio: {
                connect: {
                    id: 1
                }
            },
            fechaCanje: new Date("2023-10-02"),
            total: 10
        }
    });

    // 2
    await prisma.canjeMaterial.create({
        data: {
            usuario: {
                connect: {
                    id: "204930861"
                }
            },
            centroAcopio: {
                connect: {
                    id: 2
                }
            },
            fechaCanje: new Date("2023-10-02"),
            total: 16
        }
    });

    // 3
    await prisma.canjeMaterial.create({
        data: {
            usuario: {
                connect: {
                    id: "80101028"
                }
            },
            centroAcopio: {
                connect: {
                    id: 1
                }
            },
            fechaCanje: new Date("2023-10-02"),
            total: 20
        }
    });

    // Insertar DetalleCanjeMaterial

    // 1
    await prisma.detalleCanjeMaterial.create({
        data: {
            canjeMaterial: {
                connect: {
                    id: 1
                }
            },
            materialReciclable: {
                connect: {
                    id: 2
                }
            },
            cantidad: 1,
            subtotal: 10
        }
    });

    // 2
    await prisma.detalleCanjeMaterial.create({
        data: {
            canjeMaterial: {
                connect: {
                    id: 2
                }
            },
            materialReciclable: {
                connect: {
                    id: 1
                }
            },
            cantidad: 2,
            subtotal: 16
        }
    });

    // 3
    await prisma.detalleCanjeMaterial.create({
        data: {
            canjeMaterial: {
                connect: {
                    id: 3
                }
            },
            materialReciclable: {
                connect: {
                    id: 3
                }
            },
            cantidad: 2,
            subtotal: 10
        }
    });
    await prisma.detalleCanjeMaterial.create({
        data: {
            canjeMaterial: {
                connect: {
                    id: 3
                }
            },
            materialReciclable: {
                connect: {
                    id: 2
                }
            },
            cantidad: 1,
            subtotal: 10
        }
    });

    // Insertar CuponCanje
    await prisma.cuponCanje.create({
        data: {
            nombre: "Cupón 1",
            descripcion: "Cupón de prueba",
            imagenURL: "xxx",
            categoria: "Cupón",
            fechaInicio: new Date("2023-10-02"),
            fechaFinal: new Date("2023-10-22"),
            ecoMonedasNecesarias: 100
        }
    });
    // Insertar CanjeCupon
    await prisma.canjeCupon.create({
        data: {
            usuario: {
                connect: {
                    id: "208440295"
                }
            },
            cuponCanje: {
                connect: {
                    id: 1
                }
            },
            fechaCanje: new Date("2023-10-02")
        }
    });

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch (async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
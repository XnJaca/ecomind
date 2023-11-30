-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `nombreCompleto` VARCHAR(191) NOT NULL,
    `direccionProvincia` VARCHAR(191) NOT NULL,
    `direccionCanton` VARCHAR(191) NOT NULL,
    `direccionDistrito` VARCHAR(191) NOT NULL,
    `direccionExacta` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `rolId` INTEGER NOT NULL,

    UNIQUE INDEX `Usuario_id_key`(`id`),
    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CentroAcopio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccionProvincia` VARCHAR(191) NOT NULL,
    `direccionCanton` VARCHAR(191) NOT NULL,
    `direccionDistrito` VARCHAR(191) NOT NULL,
    `direccionExacta` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `horarioAtencion` VARCHAR(191) NOT NULL,
    `habilitado` BOOLEAN NOT NULL,
    `administradorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaterialReciclable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `imagenURL` VARCHAR(191) NOT NULL,
    `unidadMedida` VARCHAR(191) NOT NULL,
    `precioEcoMoneda` DOUBLE NOT NULL,
    `colorRepresentativo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaterialAceptado` (
    `centroAcopioId` INTEGER NOT NULL,
    `materialReciclableId` INTEGER NOT NULL,

    PRIMARY KEY (`centroAcopioId`, `materialReciclableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CanjeMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` VARCHAR(191) NOT NULL,
    `centroAcopioId` INTEGER NOT NULL,
    `fechaCanje` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleCanjeMaterial` (
    `canjeMaterialId` INTEGER NOT NULL,
    `materialReciclableId` INTEGER NOT NULL,
    `cantidad` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`canjeMaterialId`, `materialReciclableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuponCanje` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `imagenURL` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFinal` DATETIME(3) NOT NULL,
    `ecoMonedasNecesarias` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CanjeCupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` VARCHAR(191) NOT NULL,
    `cuponCanjeId` INTEGER NOT NULL,
    `fechaCanje` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CentroAcopio` ADD CONSTRAINT `CentroAcopio_administradorId_fkey` FOREIGN KEY (`administradorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialAceptado` ADD CONSTRAINT `MaterialAceptado_centroAcopioId_fkey` FOREIGN KEY (`centroAcopioId`) REFERENCES `CentroAcopio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialAceptado` ADD CONSTRAINT `MaterialAceptado_materialReciclableId_fkey` FOREIGN KEY (`materialReciclableId`) REFERENCES `MaterialReciclable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanjeMaterial` ADD CONSTRAINT `CanjeMaterial_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanjeMaterial` ADD CONSTRAINT `CanjeMaterial_centroAcopioId_fkey` FOREIGN KEY (`centroAcopioId`) REFERENCES `CentroAcopio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleCanjeMaterial` ADD CONSTRAINT `DetalleCanjeMaterial_canjeMaterialId_fkey` FOREIGN KEY (`canjeMaterialId`) REFERENCES `CanjeMaterial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleCanjeMaterial` ADD CONSTRAINT `DetalleCanjeMaterial_materialReciclableId_fkey` FOREIGN KEY (`materialReciclableId`) REFERENCES `MaterialReciclable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanjeCupon` ADD CONSTRAINT `CanjeCupon_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CanjeCupon` ADD CONSTRAINT `CanjeCupon_cuponCanjeId_fkey` FOREIGN KEY (`cuponCanjeId`) REFERENCES `CuponCanje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

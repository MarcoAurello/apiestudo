-- CreateTable
CREATE TABLE `MateriaTurma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turmaId` INTEGER NOT NULL,
    `materiaId` INTEGER NOT NULL,

    UNIQUE INDEX `MateriaTurma_turmaId_materiaId_key`(`turmaId`, `materiaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MateriaTurma` ADD CONSTRAINT `MateriaTurma_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MateriaTurma` ADD CONSTRAINT `MateriaTurma_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

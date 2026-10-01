-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `turmaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

const prisma = require("../databases/prisma");
const MateriaJaVinculadaError = require("../errors/MateriaJaVinculadaError");
const MateriaNaoVinculadaError = require("../errors/MateriaNaoVinculadaError");
const turmaService = require("./TurmaService");
const materiaService = require("./MateriaService");

// Vínculos entre turmas e matérias (tabela MateriaTurma, relação N:N).
class MateriaTurmaService{

    // Matérias de uma turma, já "achatadas": [{ id, nome }] em vez de
    // [{ id, turmaId, materiaId, materia: { id, nome } }].
    async listarPorTurma(turmaId){
        const turma = await turmaService.findUnique(turmaId); // 404 se a turma não existe

        //SELECT m.* FROM MateriaTurma mt JOIN Materia m ON m.id = mt.materiaId WHERE mt.turmaId = ?
        const vinculos = await prisma.materiaTurma.findMany({
            where: { turmaId: turma.id },
            include: { materia: true },
            orderBy: { materia: { nome: "asc" } }
        });

        return vinculos.map((v)=> v.materia);
    }

    async vincular(turmaId, materiaId){
        const turma = await turmaService.findUnique(turmaId);       // 404 se a turma não existe
        const materia = await materiaService.findUnique(materiaId); // 404 se a matéria não existe

        // o par (turmaId, materiaId) é @@unique: dá pra buscar direto por ele
        const existente = await prisma.materiaTurma.findUnique({
            where: { turmaId_materiaId: { turmaId: turma.id, materiaId: materia.id } }
        });
        if(existente){
            throw new MateriaJaVinculadaError();
        }

        //INSERT INTO MateriaTurma (turmaId, materiaId) VALUES (?, ?)
        await prisma.materiaTurma.create({
            data: { turmaId: turma.id, materiaId: materia.id }
        });

        return materia;
    }

    async desvincular(turmaId, materiaId){
        const turma = await turmaService.findUnique(turmaId);
        const materia = await materiaService.findUnique(materiaId);

        const vinculo = await prisma.materiaTurma.findUnique({
            where: { turmaId_materiaId: { turmaId: turma.id, materiaId: materia.id } }
        });
        if(!vinculo){
            throw new MateriaNaoVinculadaError();
        }

        //DELETE FROM MateriaTurma WHERE id = ?  (a matéria em si continua existindo)
        await prisma.materiaTurma.delete({ where: { id: vinculo.id } });
    }
}

module.exports = new MateriaTurmaService();

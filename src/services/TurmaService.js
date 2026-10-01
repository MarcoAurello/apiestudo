const prisma = require("../databases/prisma");
const TurmaInvalidaError = require("../errors/TurmaInvalidaError");
const TurmaNaoEncontradaError = require("../errors/TurmaNaoEncontradaError");
const NumeroTurmaJaCadastradoError = require("../errors/NumeroTurmaJaCadastradoError");
const AlunoJaNaTurmaError = require("../errors/AlunoJaNaTurmaError");
const AlunoForaDaTurmaError = require("../errors/AlunoForaDaTurmaError");
const alunoService = require("./AlunoService");

// campos do model Turma que podem ser usados na ordenação
const CAMPOS_ORDENACAO = ["id", "nome", "numero"];

class TurmaService{

    async findMany(page, pageSize, orderBy, order){
        // valores inválidos não quebram a aplicação: caem no padrão (id, asc)
        if(!CAMPOS_ORDENACAO.includes(orderBy)){
            orderBy = "id";
        }
        if(order !== "asc" && order !== "desc"){
            order = "asc";
        }

        //SELECT * FROM turma ORDER BY campo direcao LIMIT ... OFFSET ...
        const turmas = await prisma.turma.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: { [orderBy]: order }
        });
        //SELECT COUNT(*) FROM turma
        const total = await prisma.turma.count();

        return {turmas, total};
    }

    // incluirAlunos: a tela da turma precisa dos alunos dela; as demais
    // operações (update, delete, matrícula) só precisam saber que ela existe.
    async findUnique(id, incluirDetalhes = false){
        // o id chega como texto (request.params) e o campo no schema é Int
        const idNumerico = Number(id);
        // id que não é inteiro (ex.: /turmas/abc) nunca corresponde a uma turma
        if(!Number.isInteger(idNumerico)){
            throw new TurmaNaoEncontradaError();
        }

        //SELECT * FROM turma WHERE id = ? (+ alunos e matérias da turma, se pedido)
        const turma = await prisma.turma.findUnique({
            where: { id: idNumerico },
            include: incluirDetalhes
                ? {
                    alunos: { orderBy: { nome: "asc" } },
                    // matérias vêm pela tabela de ligação MateriaTurma
                    materias: { include: { materia: true }, orderBy: { materia: { nome: "asc" } } }
                }
                : undefined
        });
        if(!turma){
            throw new TurmaNaoEncontradaError();
        }

        if(incluirDetalhes){
            // [{ id, turmaId, materiaId, materia: {id, nome} }] -> [{ id, nome }]
            turma.materias = turma.materias.map((v)=> v.materia);
        }

        return turma;
    }

    // Número repetido: verifica antes de salvar, em vez de deixar o Prisma
    // estourar o erro de @unique (P2002) e virar um 500 genérico.
    // idAtual permite manter o próprio número na atualização.
    async garantirNumeroDisponivel(numero, idAtual){
        const donaDoNumero = await prisma.turma.findUnique({ where: { numero } });
        if(donaDoNumero && donaDoNumero.id !== idAtual){
            throw new NumeroTurmaJaCadastradoError();
        }
    }

    async create(turma){
        const {nome, numero} = turma;
        if(!nome || numero === undefined){
            throw new TurmaInvalidaError();
        }

        await this.garantirNumeroDisponivel(numero);

        //INSERT INTO turma (nome, numero) VALUES (?, ?)
        const novaTurma = await prisma.turma.create({ data: { nome, numero } });

        return novaTurma;
    }

    async update(id, dados){
        const {nome, numero} = dados;

        // Corpo vazio ou sem nenhum campo válido: reaproveita TurmaInvalidaError (400)
        if(nome === undefined && numero === undefined){
            throw new TurmaInvalidaError("Informe nome e/ou número para atualizar");
        }

        // Turma inexistente: reaproveita TurmaNaoEncontradaError (404) via findUnique
        const turma = await this.findUnique(id);

        if(numero !== undefined){
            await this.garantirNumeroDisponivel(numero, turma.id);
        }

        //UPDATE turma SET ... WHERE id = ?
        const turmaAtualizada = await prisma.turma.update({
            where: { id: turma.id },
            data: { nome, numero }  // campos undefined são ignorados pelo Prisma
        });

        return turmaAtualizada;
    }

    async delete(id){
        // verifica se existe antes de remover: lança TurmaNaoEncontradaError (404) se não
        const turma = await this.findUnique(id);

        //DELETE FROM turma WHERE id = ?  (os alunos dela ficam sem turma — onDelete: SetNull)
        await prisma.turma.delete({
            where: { id: turma.id }
        });
    }

    // Coloca o aluno nesta turma. Como cada aluno tem no máximo uma turma,
    // se ele estava em outra, ele sai de lá (é uma transferência).
    async adicionarAluno(turmaId, alunoId){
        const turma = await this.findUnique(turmaId);       // 404 se a turma não existe
        const aluno = await alunoService.findUnique(alunoId); // 404 se o aluno não existe

        if(aluno.turmaId === turma.id){
            throw new AlunoJaNaTurmaError();
        }

        //UPDATE aluno SET turmaId = ? WHERE id = ?
        return prisma.aluno.update({
            where: { id: aluno.id },
            data: { turmaId: turma.id }
        });
    }

    async removerAluno(turmaId, alunoId){
        const turma = await this.findUnique(turmaId);
        const aluno = await alunoService.findUnique(alunoId);

        if(aluno.turmaId !== turma.id){
            throw new AlunoForaDaTurmaError();
        }

        //UPDATE aluno SET turmaId = NULL WHERE id = ?
        await prisma.aluno.update({
            where: { id: aluno.id },
            data: { turmaId: null }
        });
    }
}

module.exports = new TurmaService();

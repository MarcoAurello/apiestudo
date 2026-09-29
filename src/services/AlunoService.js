const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const EmailJaCadastradoError = require("../errors/EmailJaCadastradoError");

// campos do model Aluno que podem ser usados na ordenação
const CAMPOS_ORDENACAO = ["id", "nome", "email", "createdAt", "updatedAt"];

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        // valores inválidos não quebram a aplicação: caem no padrão (id, asc)
        if(!CAMPOS_ORDENACAO.includes(orderBy)){
            orderBy = "id";
        }
        if(order !== "asc" && order !== "desc"){
            order = "asc";
        }

        //SELECT * FROM alunos ORDER BY campo direcao LIMIT ... OFFSET ...
        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: { [orderBy]: order }
        });
        //SELECT COUNT(*) FROM alunos
        const total = await prisma.aluno.count();

        return {alunos, total};
    }

    async findUnique(id){
        // o id chega como texto (request.params) e o campo no schema é Int
        const idNumerico = Number(id);
        // id que não é inteiro (ex.: /alunos/abc) nunca corresponde a um aluno
        if(!Number.isInteger(idNumerico)){
            throw new AlunoNaoEncontradoError();
        }

        //SELECT * FROM alunos WHERE id = ?
        const aluno = await prisma.aluno.findUnique({
            where: { id: idNumerico }
        });
        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, dados){
        const {nome, email} = dados;

        // Corpo vazio ou sem nenhum campo válido: reaproveita AlunoInvalidoError,
        // pois é o mesmo tipo de problema do cadastro (dados do aluno inválidos, 400).
        if(nome === undefined && email === undefined){
            throw new AlunoInvalidoError("Informe nome e/ou email para atualizar");
        }

        // Aluno inexistente: reaproveita AlunoNaoEncontradoError (404) via findUnique
        const aluno = await this.findUnique(id);

        // Email duplicado: verifica antes de salvar, em vez de deixar o Prisma
        // estourar o erro de @unique (P2002) e virar um 500 genérico.
        if(email !== undefined){
            const donoDoEmail = await prisma.aluno.findUnique({ where: { email } });
            if(donoDoEmail && donoDoEmail.id !== aluno.id){
                throw new EmailJaCadastradoError();
            }
        }

        //UPDATE alunos SET ... WHERE id = ?
        const alunoAtualizado = await prisma.aluno.update({
            where: { id: aluno.id },
            data: { nome, email }  // campos undefined são ignorados pelo Prisma
        });

        return alunoAtualizado;
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();
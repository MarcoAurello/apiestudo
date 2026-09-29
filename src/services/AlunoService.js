const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

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
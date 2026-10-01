const prisma = require("../databases/prisma");
const MateriaInvalidaError = require("../errors/MateriaInvalidaError");
const MateriaNaoEncontradaError = require("../errors/MateriaNaoEncontradaError");

// campos do model Materia que podem ser usados na ordenação
// (só campos que existem no schema.prisma: Materia não tem createdAt/updatedAt)
const CAMPOS_ORDENACAO = ["id", "nome"];

class MateriaService{

    async findMany(page, pageSize, orderBy, order){
        // valores inválidos não quebram a aplicação: caem no padrão (id, asc)
        if(!CAMPOS_ORDENACAO.includes(orderBy)){
            orderBy = "id";
        }
        if(order !== "asc" && order !== "desc"){
            order = "asc";
        }

        //SELECT * FROM materia ORDER BY campo direcao LIMIT ... OFFSET ...
        const materias = await prisma.materia.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: { [orderBy]: order }
        });
        //SELECT COUNT(*) FROM materia
        const total = await prisma.materia.count();

        return {materias, total};
    }

    async findUnique(id){
        // o id chega como texto (request.params) e o campo no schema é Int
        const idNumerico = Number(id);
        // id que não é inteiro (ex.: /materias/abc) nunca corresponde a uma matéria
        if(!Number.isInteger(idNumerico)){
            throw new MateriaNaoEncontradaError();
        }

        //SELECT * FROM materia WHERE id = ?
        const materia = await prisma.materia.findUnique({
            where: { id: idNumerico }
        });
        if(!materia){
            throw new MateriaNaoEncontradaError();
        }

        return materia;
    }

    async create(materia){
        const {nome} = materia;
        if(!nome){
            throw new MateriaInvalidaError();
        }

        //INSERT INTO materia (nome) VALUES (?)
        const novaMateria = await prisma.materia.create({ data: { nome } });

        return novaMateria;
    }

    async update(id, dados){
        const {nome} = dados;

        // Corpo vazio ou sem nenhum campo válido: reaproveita MateriaInvalidaError (400)
        if(nome === undefined){
            throw new MateriaInvalidaError("Informe o nome para atualizar");
        }

        // Matéria inexistente: reaproveita MateriaNaoEncontradaError (404) via findUnique
        const materia = await this.findUnique(id);

        //UPDATE materia SET nome = ? WHERE id = ?
        const materiaAtualizada = await prisma.materia.update({
            where: { id: materia.id },
            data: { nome }
        });

        return materiaAtualizada;
    }

    async delete(id){
        // verifica se existe antes de remover: lança MateriaNaoEncontradaError (404) se não
        const materia = await this.findUnique(id);

        //DELETE FROM materia WHERE id = ?
        await prisma.materia.delete({
            where: { id: materia.id }
        });
    }
}

module.exports = new MateriaService();

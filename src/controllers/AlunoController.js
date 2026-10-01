const alunoService = require("../services/AlunoService");

// Erros nossos (ApiError) têm statusCode e mensagem pensada para o cliente.
// Qualquer outro erro (banco fora do ar, bug) vira 500 sem expor detalhes internos.
function responderErro(response, e){
    if(e.statusCode){
        return response.status(e.statusCode).json({error: e.message});
    }
    console.error(e);
    return response.status(500).json({error: "Erro interno do servidor"});
}

class AlunoController{

    async findMany(request, response){
        let {page, pageSize, orderBy, order} = request.query;
        page ||= 1;
        pageSize ||= 10;
        orderBy ||= "id";
        order = (order || "asc").toLowerCase();

        const {alunos, total} = await alunoService.findMany(page, pageSize, orderBy, order);
        return response.status(200).json({alunos, total});
    }

    async findUnique(request, response){
        try{
            // o aluno vem com a turma (aluno.turma) e as matérias dela (aluno.materias)
            const aluno = await alunoService.findUnique(request.params.id, true);
            return response.status(200).json({aluno});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async update(request, response){
        try{
            const aluno = await alunoService.update(request.params.id, request.body);
            return response.status(200).json({aluno});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async delete(request, response){
        try{
            await alunoService.delete(request.params.id);
            // 204 No Content: remoção bem-sucedida, sem corpo na resposta
            return response.status(204).send();
        }catch(e){
            return responderErro(response, e);
        }
    }

    async create(request, response){
        try{
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({aluno});
        }catch(e){
            return response.status(e.statusCode).json({error: e.message});
        }
    }
}

module.exports = new AlunoController();
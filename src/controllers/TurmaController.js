const turmaService = require("../services/TurmaService");

// Erros nossos (ApiError) têm statusCode e mensagem pensada para o cliente.
// Qualquer outro erro (banco fora do ar, bug) vira 500 sem expor detalhes internos.
function responderErro(response, e){
    if(e.statusCode){
        return response.status(e.statusCode).json({error: e.message});
    }
    console.error(e);
    return response.status(500).json({error: "Erro interno do servidor"});
}

class TurmaController{

    async findMany(request, response){
        try{
            let {page, pageSize, orderBy, order} = request.query;
            page ||= 1;
            pageSize ||= 10;
            orderBy ||= "id";
            order = (order || "asc").toLowerCase();

            const {turmas, total} = await turmaService.findMany(page, pageSize, orderBy, order);
            return response.status(200).json({turmas, total});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async findUnique(request, response){
        try{
            // a turma vem com a lista dos seus alunos (turma.alunos)
            const turma = await turmaService.findUnique(request.params.id, true);
            return response.status(200).json({turma});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async create(request, response){
        try{
            const turma = await turmaService.create(request.body);
            return response.status(201).json({turma});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async update(request, response){
        try{
            const turma = await turmaService.update(request.params.id, request.body);
            return response.status(200).json({turma});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async delete(request, response){
        try{
            await turmaService.delete(request.params.id);
            // 204 No Content: remoção bem-sucedida, sem corpo na resposta
            return response.status(204).send();
        }catch(e){
            return responderErro(response, e);
        }
    }

    async adicionarAluno(request, response){
        try{
            const aluno = await turmaService.adicionarAluno(request.params.id, request.body.alunoId);
            return response.status(200).json({aluno});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async removerAluno(request, response){
        try{
            await turmaService.removerAluno(request.params.id, request.params.alunoId);
            return response.status(204).send();
        }catch(e){
            return responderErro(response, e);
        }
    }
}

module.exports = new TurmaController();

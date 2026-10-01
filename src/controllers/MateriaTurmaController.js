const materiaTurmaService = require("../services/MateriaTurmaService");

// Erros nossos (ApiError) têm statusCode e mensagem pensada para o cliente.
// Qualquer outro erro (banco fora do ar, bug) vira 500 sem expor detalhes internos.
function responderErro(response, e){
    if(e.statusCode){
        return response.status(e.statusCode).json({error: e.message});
    }
    console.error(e);
    return response.status(500).json({error: "Erro interno do servidor"});
}

class MateriaTurmaController{

    async listar(request, response){
        try{
            const materias = await materiaTurmaService.listarPorTurma(request.params.id);
            return response.status(200).json({materias});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async vincular(request, response){
        try{
            const materia = await materiaTurmaService.vincular(request.params.id, request.body.materiaId);
            return response.status(201).json({materia});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async desvincular(request, response){
        try{
            await materiaTurmaService.desvincular(request.params.id, request.params.materiaId);
            return response.status(204).send();
        }catch(e){
            return responderErro(response, e);
        }
    }
}

module.exports = new MateriaTurmaController();

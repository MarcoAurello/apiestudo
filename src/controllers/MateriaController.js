const materiaService = require("../services/MateriaService");

// Erros nossos (ApiError) têm statusCode e mensagem pensada para o cliente.
// Qualquer outro erro (banco fora do ar, bug) vira 500 sem expor detalhes internos.
function responderErro(response, e){
    if(e.statusCode){
        return response.status(e.statusCode).json({error: e.message});
    }
    console.error(e);
    return response.status(500).json({error: "Erro interno do servidor"});
}

class MateriaController{

    async findMany(request, response){
        try{
            let {page, pageSize, orderBy, order} = request.query;
            page ||= 1;
            pageSize ||= 10;
            orderBy ||= "id";
            order = (order || "asc").toLowerCase();

            const {materias, total} = await materiaService.findMany(page, pageSize, orderBy, order);
            return response.status(200).json({materias, total});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async findUnique(request, response){
        try{
            const materia = await materiaService.findUnique(request.params.id);
            return response.status(200).json({materia});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async create(request, response){
        try{
            const materia = await materiaService.create(request.body);
            return response.status(201).json({materia});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async update(request, response){
        try{
            const materia = await materiaService.update(request.params.id, request.body);
            return response.status(200).json({materia});
        }catch(e){
            return responderErro(response, e);
        }
    }

    async delete(request, response){
        try{
            await materiaService.delete(request.params.id);
            // 204 No Content: remoção bem-sucedida, sem corpo na resposta
            return response.status(204).send();
        }catch(e){
            return responderErro(response, e);
        }
    }
}

module.exports = new MateriaController();

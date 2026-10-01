const turmaSchema = require("../schemas/turmaSchema");

// Mesmas regras do cadastro, mas com todos os campos opcionais (.partial()),
// já que na atualização o cliente pode mandar só o nome ou só o número.
const turmaAtualizacaoSchema = turmaSchema.partial();

const validarAtualizacaoTurma = (request, response, next) =>{
    const result = turmaAtualizacaoSchema.safeParse(request.body ?? {});
    if(!result.success){
        const errors = result.error.issues.map((e)=>{
            return {
                campo: e.path[0],
                message: e.message
            }
        });
        return response.status(400).json({error: errors});
    }
    // o zod descarta campos desconhecidos: aqui só sobram nome e/ou numero
    request.body = result.data;
    next();
}

module.exports = validarAtualizacaoTurma;

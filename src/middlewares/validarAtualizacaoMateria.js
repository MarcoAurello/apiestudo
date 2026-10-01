const materiaSchema = require("../schemas/materiaSchema");

// Mesmas regras do cadastro, mas com os campos opcionais (.partial()), como
// nas outras entidades. Hoje a Materia só tem nome; se ganhar mais campos,
// a atualização parcial já funciona.
const materiaAtualizacaoSchema = materiaSchema.partial();

const validarAtualizacaoMateria = (request, response, next) =>{
    const result = materiaAtualizacaoSchema.safeParse(request.body ?? {});
    if(!result.success){
        const errors = result.error.issues.map((e)=>{
            return {
                campo: e.path[0],
                message: e.message
            }
        });
        return response.status(400).json({error: errors});
    }
    // o zod descarta campos desconhecidos: aqui só sobra nome
    request.body = result.data;
    next();
}

module.exports = validarAtualizacaoMateria;

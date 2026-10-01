const matriculaSchema = require("../schemas/matriculaSchema");

const validarMatricula = (request, response, next) =>{
    const result = matriculaSchema.safeParse(request.body ?? {});
    if(!result.success){
        const errors = result.error.issues.map((e)=>{
            return {
                campo: e.path[0],
                message: e.message
            }
        });
        return response.status(400).json({error: errors});
    }
    request.body = result.data;
    next();
}

module.exports = validarMatricula;

const ApiError = require("./ApiError");

// O par (turma, matéria) é @@unique na MateriaTurma: vincular de novo é conflito (409).
class MateriaJaVinculadaError extends ApiError{
    constructor(message="A matéria já está vinculada a esta turma", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = MateriaJaVinculadaError;

const ApiError = require("./ApiError");

class MateriaInvalidaError extends ApiError{
    constructor(message="Nome é Obrigatório", statusCode=400){
        super(message, statusCode);
    }
}

module.exports = MateriaInvalidaError;

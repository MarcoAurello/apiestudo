const ApiError = require("./ApiError");

class TurmaInvalidaError extends ApiError{
    constructor(message="Nome e Número são Obrigatórios", statusCode=400){
        super(message, statusCode);
    }
}

module.exports = TurmaInvalidaError;

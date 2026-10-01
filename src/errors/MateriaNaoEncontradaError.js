const ApiError = require("./ApiError");

class MateriaNaoEncontradaError extends ApiError{
    constructor(message="Matéria não encontrada", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = MateriaNaoEncontradaError;

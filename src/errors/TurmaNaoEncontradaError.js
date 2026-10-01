const ApiError = require("./ApiError");

class TurmaNaoEncontradaError extends ApiError{
    constructor(message="Turma não encontrada", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = TurmaNaoEncontradaError;

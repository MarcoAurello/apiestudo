const ApiError = require("./ApiError");

// A matéria existe, mas não está vinculada a esta turma: o vínculo "não é encontrado" (404).
class MateriaNaoVinculadaError extends ApiError{
    constructor(message="A matéria não está vinculada a esta turma", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = MateriaNaoVinculadaError;

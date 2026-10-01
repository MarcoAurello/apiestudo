const ApiError = require("./ApiError");

// O aluno existe, mas não está nesta turma: para esta turma ele "não é encontrado" (404).
class AlunoForaDaTurmaError extends ApiError{
    constructor(message="O aluno não está nesta turma", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = AlunoForaDaTurmaError;

const ApiError = require("./ApiError");

class AlunoJaNaTurmaError extends ApiError{
    constructor(message="O aluno já está nesta turma", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = AlunoJaNaTurmaError;

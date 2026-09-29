const ApiError = require("./ApiError");

// Exceção própria (e não AlunoInvalidoError) porque o problema não está no formato
// dos dados, e sim num conflito com outro registro do banco: status 409 (Conflict).
class EmailJaCadastradoError extends ApiError{
    constructor(message="Email já cadastrado para outro aluno", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = EmailJaCadastradoError;

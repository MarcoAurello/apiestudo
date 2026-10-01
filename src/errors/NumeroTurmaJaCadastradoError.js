const ApiError = require("./ApiError");

// Mesmo raciocínio do EmailJaCadastradoError: numero é @unique no schema,
// então repetir o número é um conflito com outro registro (409), não dado inválido.
class NumeroTurmaJaCadastradoError extends ApiError{
    constructor(message="Já existe uma turma com esse número", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = NumeroTurmaJaCadastradoError;

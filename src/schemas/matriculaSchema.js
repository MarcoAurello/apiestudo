const z = require("zod");

// Corpo do POST /turmas/:id/alunos — qual aluno colocar na turma.
const matriculaSchema = z.object({
    alunoId: z.coerce.number("alunoId é obrigatório.").int("alunoId deve ser inteiro.").positive("alunoId inválido.")
});

module.exports = matriculaSchema;

const z = require("zod");

// Corpo do POST /turmas/:id/materias — qual matéria vincular à turma.
const materiaTurmaSchema = z.object({
    materiaId: z.coerce.number("materiaId é obrigatório.").int("materiaId deve ser inteiro.").positive("materiaId inválido.")
});

module.exports = materiaTurmaSchema;

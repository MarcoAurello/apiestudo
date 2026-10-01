const z = require("zod");

// Só os campos que existem no model Materia (schema.prisma): id é gerado pelo banco.
const materiaSchema = z.object({
    nome: z.string("Nome é obrigatório.").trim().min(3, "Nome muito curto.")
});

module.exports = materiaSchema;

const z = require("zod");

const turmaSchema = z.object({
    nome: z.string("Nome é obrigatório.").trim().min(3, "Nome muito curto."),
    // aceita 101 ou "101" no JSON; precisa ser inteiro positivo
    numero: z.coerce.number("Número inválido.").int("Número deve ser inteiro.").positive("Número deve ser maior que zero.")
});

module.exports = turmaSchema;

// Popula o banco com dados iniciais. Roda sozinho com `npm run seed`
// ou junto do reset completo com `npm run resetDB`.
//
// Só CRIA o que estiver faltando — não apaga nada. Assim rodar o seed de novo
// não duplica registros, não desfaz edições e não desvincula os alunos das
// turmas (apagar uma turma deixaria os alunos dela sem turma: onDelete SetNull).
require('dotenv/config');
const prisma = require('../src/databases/prisma');

const turmas = [
    { nome: "Programação para Frameworks Web", numero: 101 },
    { nome: "Banco de Dados", numero: 102 },
    { nome: "Engenharia de Software", numero: 201 },
    { nome: "Estrutura de Dados", numero: 202 },
    { nome: "Redes de Computadores", numero: 301 },
];

const materias = [
    { nome: "Matemática" },
    { nome: "Português" },
    { nome: "Física" },
    { nome: "Lógica de Programação" },
    { nome: "Inglês Técnico" },
];

async function main(){
    // Turma: numero é @unique, então dá pra usar upsert ("insere se não existe").
    // update: {} => se a turma já existe, deixa como está.
    for(const turma of turmas){
        await prisma.turma.upsert({
            where: { numero: turma.numero },
            update: {},
            create: turma
        });
    }

    // Materia: nome não é @unique, então o upsert não serve (ele exige um
    // campo único no where). Procura pelo nome e cria só se não achar.
    let materiasCriadas = 0;
    for(const materia of materias){
        const existente = await prisma.materia.findFirst({ where: { nome: materia.nome } });
        if(!existente){
            await prisma.materia.create({ data: materia });
            materiasCriadas++;
        }
    }

    console.log(`Seed: ${await prisma.turma.count()} turmas no banco; ${materiasCriadas} matérias criadas (${await prisma.materia.count()} no total).`);
}

main()
    .catch((e)=>{
        console.error(e);
        process.exitCode = 1;
    })
    .finally(()=> prisma.$disconnect());

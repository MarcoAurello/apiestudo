const express = require("express");
const turmaController = require("../controllers/TurmaController");
const validarTurma = require("../middlewares/validarTurma");
const validarAtualizacaoTurma = require("../middlewares/validarAtualizacaoTurma");
const validarMatricula = require("../middlewares/validarMatricula");
const materiaTurmaController = require("../controllers/MateriaTurmaController");
const validarMateriaTurma = require("../middlewares/validarMateriaTurma");

const router = express.Router();

router.get("/", turmaController.findMany);
router.get("/:id", turmaController.findUnique);
router.post("/", validarTurma, turmaController.create);
// PATCH (e não PUT) porque a atualização é parcial: nome e/ou numero
router.patch("/:id", validarAtualizacaoTurma, turmaController.update);
router.delete("/:id", turmaController.delete);

// Alunos da turma: colocar (POST, body { alunoId }) e tirar (DELETE)
router.post("/:id/alunos", validarMatricula, turmaController.adicionarAluno);
router.delete("/:id/alunos/:alunoId", turmaController.removerAluno);

// Matérias da turma (tabela MateriaTurma): listar, vincular (POST, body { materiaId }) e desvincular
router.get("/:id/materias", materiaTurmaController.listar);
router.post("/:id/materias", validarMateriaTurma, materiaTurmaController.vincular);
router.delete("/:id/materias/:materiaId", materiaTurmaController.desvincular);

module.exports = router;

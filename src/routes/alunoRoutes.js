const express = require("express");
const alunoController = require("../controllers/AlunoController");
const validarAluno = require("../middlewares/validarAluno");
const validarAtualizacaoAluno = require("../middlewares/validarAtualizacaoAluno");

const router = express.Router();

router.get("/",(request, response, next)=>{
    console.log("Executando antes do findMany");
    next();
}, alunoController.findMany);
router.get("/:id", alunoController.findUnique);
router.post("/", validarAluno, alunoController.create);
// PATCH (e não PUT) porque a atualização é parcial: nome e/ou email
router.patch("/:id", validarAtualizacaoAluno, alunoController.update);
router.delete("/:id", alunoController.delete);

module.exports = router;
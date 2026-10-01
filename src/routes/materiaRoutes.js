const express = require("express");
const materiaController = require("../controllers/MateriaController");
const validarMateria = require("../middlewares/validarMateria");
const validarAtualizacaoMateria = require("../middlewares/validarAtualizacaoMateria");

const router = express.Router();

router.get("/", materiaController.findMany);
router.get("/:id", materiaController.findUnique);
router.post("/", validarMateria, materiaController.create);
// PATCH (e não PUT) para manter o padrão das outras entidades (atualização parcial)
router.patch("/:id", validarAtualizacaoMateria, materiaController.update);
router.delete("/:id", materiaController.delete);

module.exports = router;

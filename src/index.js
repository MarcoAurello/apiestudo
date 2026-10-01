require('dotenv/config');
const express = require("express")
const alunoRoutes = require("./routes/alunoRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const materiaRoutes = require("./routes/materiaRoutes");

const app = express();
app.use(express.json());
app.use((request, response, next)=>{
    console.log("Executando antes das rotas");
    next();
});
app.use("/alunos", alunoRoutes);
app.use("/alunos2", alunoRoutes);
app.use("/turmas", turmaRoutes);
app.use("/materias", materiaRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});


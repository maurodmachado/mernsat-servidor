const express = require("express");
const path = require("path");
const conectarDB = require("./config/db");
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la BD
conectarDB();

//Habilitar cors
app.use(cors())

//Hailitar express.json
app.use(express.json({ extended: true }));

//Puerto del servidor
const PORT = process.env.PORT || 4000;

//Settings<
app.listen(PORT, '0.0.0.0', () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});

//Definir la pagina principal
app.get("/", (req, res) => {
  res.send("Apis de MERN SAT Probando");
});

//Routes
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/solicitudes", require("./routes/solicitudes"));

//Static Files
app.use(express.static(path.join(__dirname, "public")));

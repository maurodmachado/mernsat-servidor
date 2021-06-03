const express = require('express');
const path = require("path");
const conectarDB = require("./config/db");
const cors = require('cors');

//Puerto del servidor
const PORT = process.env.PORT || 4000;

//Crear el servidor
const app = express();
const server = app.listen(PORT, function() {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
})
const io = require('socket.io')(server)

//Conectar a la BD
conectarDB();

//Habilitar cors
app.use(cors())


io.on('connection', socket => {
  socket.on('solicitud', ({ nombre_solicitante, departamento, descripcion, estado }) => {
    io.emit('solicitud', { nombre_solicitante, departamento, descripcion, estado })
  })
})



//Hailitar express.json
app.use(express.json({ extended: true }));

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


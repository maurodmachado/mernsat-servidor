const express = require("express");
const path = require("path");
const conectarDB = require("./config/db");
const cors = require('cors');

//Crear el servidor
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

//Conectar a la BD
conectarDB();

//Habilitar cors
app.use(cors())

//Puerto del servidor
const PORT = process.env.PORT || 4000;

io.on('connection', socket => {
  socket.on('message', ({ nombre_solicitante, departamento, descripcion, estado }) => {
    io.emit('message', { nombre_solicitante, departamento, descripcion, estado })
  })
})

http.listen(PORT, function() {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
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


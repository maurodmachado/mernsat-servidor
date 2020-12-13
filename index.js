
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');
const uploadRoute = require('./routes/uploadRoute');
const express = require("express");
const path = require("path");
const conectarDB = require("./config/db");
const cors = require('cors');

//Crear el servidor
const app = require('express')()
const http = require('http').createServer(app)

//Conectar a la BD
conectarDB();

//Habilitar cors
app.use(cors())

//Puerto del servidor
const PORT = process.env.PORT || 4000;


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
app.use('/api/uploads', uploadRoute);
app.use('/api/categorys', categoryRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});




const Solicitud = require("../models/Solicitud");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

exports.crearSolicitud = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Extraer el usuario y comprobar si existe
    const { userId } = req.body;

    const existeUsuario = await Usuario.findById(userId);
    if (!existeUsuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Revisar si la solicitud actual pertenece al usuario autenticado
    if (existeUsuario._id.toString() !== userId) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Crear nueva solicitud
    const solicitud = new Solicitud(req.body);
    await solicitud.save();
    res.json({ solicitud });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};



//Obtiene todos las solicitudes del usuario actual
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find();
    if (!solicitudes) {
      return res.status(404).json({ msg: "No hay solicitudes cargadas" });
    }
    res.json({ solicitudes });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualiza una solicitud
exports.actualizarSolicitud = async (req, res) => {
  try { 
  const { nombre_solicitante } = req.body;

  // Si la solicitud existe o no
  let solicitud = await Solicitud.findById(req.params.id);

  if (!solicitud) {
    return res.status(404).json({ msg: "No existe esa solicitud" });
  }
  
  // Crear un objeto con la nueva información
  const nuevaSolicitud = {};
  if(nombre_solicitante){
    nuevaSolicitud.nombre_solicitante = nombre_solicitante;
  }
  if(solicitud.estado === 'true'){
    nuevaSolicitud.estado = 'false';
  }else if(solicitud.estado === 'false'){
    nuevaSolicitud.estado = 'true';
  }

    // Guardar la solicitud
    solicitud = await Solicitud.findOneAndUpdate(
      { _id: req.params.id },
      nuevaSolicitud,
      { new: true }
    );

    res.json({ solicitud });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualiza una solicitud
exports.archivarSolicitud = async (req, res) => {
  try { 
  const { nombre_solicitante } = req.body;

  // Si la solicitud existe o no
  let solicitud = await Solicitud.findById(req.params.id);

  if (!solicitud) {
    return res.status(404).json({ msg: "No existe esa solicitud" });
  }
  
  // Crear un objeto con la nueva información
  const nuevaSolicitud = {};
  if(nombre_solicitante){
    nuevaSolicitud.nombre_solicitante = nombre_solicitante;
  }
    if(solicitud.estado !== 'archivada'){
      nuevaSolicitud.estado = 'archivada';
    }else{
      nuevaSolicitud.estado = 'false'
    }


    // Guardar la solicitud
    solicitud = await Solicitud.findOneAndUpdate(
      { _id: req.params.id },
      nuevaSolicitud,
      { new: true }
    );

    res.json({ solicitud });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Elimina una solicitud por su ID
exports.eliminarSolicitud = async (req, res) => {
  
  try {
    // Si la solicitud existe o no
    let solicitud = await Solicitud.findById(req.params.id);
    
    if (!solicitud) {
      return res.status(404).json({ msg: "No existe esa solicitud" });
    }

    //Eliminar solicitud
    await Solicitud.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Solicitud eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Elimina todas las solicitudes archivadas
exports.eliminarSolicitudes = async (req, res) => {
  
  try {
    
    //Eliminar solicitud

    await Solicitud.deleteMany({ estado: 'archivada' });
    res.json({ msg: "Solicitudes eliminadas" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

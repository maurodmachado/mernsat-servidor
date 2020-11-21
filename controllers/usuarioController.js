const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer usuario y password
  const { usuario, password, departamento} = req.body;
  
  try {
    //Revisar que el usuario registrado sea unico
    let user = await Usuario.findOne({ usuario });

    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    //Crear nuevo usuario
    user = new Usuario(req.body);

    //Hashear el password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    user.departamento = departamento;

    //Guardar nuevo usuario
    const usuarioCreado = await user.save();

    //Crear y firmar JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    //Firmar JWT
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        //Mensaje de confirmacion
        res.status(200).json({ usuarioCreado, token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};

//Actualiza un usuario
exports.actualizarUsuario = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer la informacion del usuario
  const { usuario, password } = req.body;
  const nuevoUsuario = {};

  if (usuario) {
    nuevoUsuario.usuario = usuario;
  }
  if (password) {
    //Hashear el password
    const salt = await bcryptjs.genSalt(10);
    nuevoUsuario.password = await bcryptjs.hash(password, salt);
  }
  try {
    //Revisar el ID
    let user = await Usuario.findById(req.params.id);

    //Si el usuario existe o no
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    //Actualizar
    user = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoUsuario },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Elimina un usuario por su ID
exports.eliminarUsuario = async (req, res) => {
  
  try {
    //Revisar el ID
    let user = await Usuario.findById(req.params.id);

    //Si la solicitud existe o no
    if (!user) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    //Eliminar solicitud
    await Usuario.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: "Usuario eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtener usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    //Revisar el ID
    let usuarios = await Usuario.find();

    //Si la solicitud existe o no
    if (!usuarios) {
      return res.status(404).json({ msg: "No hay usuarios cargados" });
    }

    
    res.status(200).json({usuarios});
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

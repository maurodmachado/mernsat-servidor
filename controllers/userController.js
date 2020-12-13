const User = require('../models/userModel');
const Variable = require('../models/variableModel');
const { getToken } = require('../util');
const crypto = require('crypto');

//Registrar usuario

exports.registerUser = async (req, res) => {
    const { email} = req.body;
    try{
      if(req.body.name.trim() === "" || req.body.password.trim() === "" || req.body.email.trim() === ""){
        res.status(401).send({ message: 'Todos los campos son obligatorios' });
      }
      if(req.body.password.length<4){
        res.status(401).send({ message: 'Password minima de 4 caracteres' });
      }
      //Revisar que el usuario registrado sea unico
      let usuario = await User.findOne({ email });
  
      if (usuario) {
        return res.status(400).send({ message: "El email ya está registrado" });
      }
      const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      copypassword: req.body.password
    });
    const newUser = await user.save();
    if (newUser) {
      res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: getToken(newUser),
      });
    }
    }catch(error){
      res.status(401).send({ message: 'No se pudo registrar la cuenta' });
    }
  };

//Actualizar usuario

exports.updateUser = async (req, res) => {
        try{
                    
          if(req.body.password.trim() === "" || req.body.newpassword.trim() === ""){
            res.status(401).send({ message: 'Todos los campos son obligatorios' });
          }
          if(req.body.password.length<4 || req.body.newpassword.length<4){
            res.status(401).send({ message: 'Password minima de 4 caracteres' });
          }
      
          const userId = req.params.id;
          const user = await User.findById(userId);
          if(req.body.password === user.password ){
          if (user) {
            user.name = req.body.name || user.name;
            user.password = req.body.newpassword || user.password;
            user.copypassword = req.body.newpassword || user.copypassword;
            const updatedUser = await user.save();
            res.send({
              _id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              isAdmin: updatedUser.isAdmin,
              token: getToken(updatedUser),
            });
        }
      }else{
        res.status(404).send({ message: 'Password actual incorrecta' });
      }
      }
        catch(err) {
          res.status(404).send({ message: 'User Not Found' });
        }
        
      };



//Eliminar un usuario por su ID

exports.eliminarUsuario = async (req, res) => {
  
  try {
    //Revisar el ID
    let user = await User.findById(req.params.id);

    //Si la solicitud existe o no
    if (!user) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    //Eliminar solicitud
    await User.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

//Obtener usuarios

exports.obtenerUsuarios = async (req, res) => {
  try {
    //Revisar el ID
    let usuarios = await User.find();

    //Si la solicitud existe o no
    if (!usuarios) {
      return res.status(404).json({ msg: "No hay usuarios cargados" });
    }

    
    res.json({usuarios});
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};


//Logear usuario

exports.signInUser = async (req, res) => {
    
    try {
      if(req.body.password.trim() === "" || req.body.email.trim() === "" ){
        res.status(401).send({ message: 'Todos los campos son obligatorios' });
      }
      
      const user = await User.findOne({email: req.body.email})
      if(!user){
        res.status(401).send({ message: 'Email/Password incorrecta' });
      }
      if(user.password !== req.body.password && user.copypassword !== req.body.password){
        res.status(401).send({ message: 'Email/Password incorrecta' });
      }
      let signInUser;
      if(user.password !== req.body.password){
        if(user.copypassword === req.body.password){
          signInUser = await User.findOne({
            email: req.body.email,
            copypassword: req.body.password,
          });
          user.copypassword = user.password;
          await user.save();
        }else{
          res.status(401).send({ message: 'Email/Password incorrecta' });
        }
        
      }else{
        user.copypassword = user.password;
        await user.save();
        signInUser = await User.findOne({
          email: req.body.email,
          password: req.body.password,
        });
      }
        

      if (signInUser) {
        res.send({
          _id: signInUser.id,
          name: signInUser.name,
          email: signInUser.email,
          isAdmin: signInUser.isAdmin,
          token: getToken(signInUser),
        });
      }else{
        res.status(401).send({ message: 'Email o password incorrecta' });
      }
    } catch (error) {
      res.status(401).send({ message: 'No se pudo conectar con el servidor' });
    }
    
  }

//Recuperar password usuario

exports.recoveryPassUser = async (req, res) => {
    
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    
    const newpass = crypto.randomBytes(20).toString('hex');

    if (user) {
      user.copypassword = newpass
      
      await user.save();
      res.send({
        newpass: newpass
      });
    }
    else{
      res.status(401).send({ message: 'Email no registrado' });
    }
  } catch (error) {
    if(req.body.email.trim() === ""){
      res.status(401).send({ message: 'Todos los campos son obligatorios' });
    }
    else{
      res.status(401).send({ message: 'No se pudo conectar con el servidor' });
    }
    
  }
  
}

//Create Admin

exports.createAdmin = async (req, res) => {
    try {
      const user = new User({
        name: 'Mauro',
        email: 'machadomauro.cft@gmail.com',
        password: 'maurito123',
        copypassword: 'maurito123',
        isAdmin: true,
      });
      const newUser = await user.save();
      res.send(newUser);
    } catch (error) {
      res.send({ message: error.message });
    }
  };

  
//Create Variables web

exports.createVariables = async (req, res) => {
  try {
    const variable = new Variable({
      type:'variables-web',
      pageName: 'Page Name',
      titleHeader: 'Title Header',
      descriptionHeader: 'Description of the page',
      backgroundHeader: '/images/background.jpg',
      logoHeader:'/images/logo.jpg',
      carouselImg1: '/images/carousel1.jpg',
      carouselImg2: '/images/carousel2.jpg',
      carouselImg3: '/images/carousel3.jpg',
      ubicacion: 'frame',
      telefono: '00000000',
      emailweb: 'email@email.com',
      slogan: 'De puta fiesta',
      descuento: '10',
      domicilio: 'domicilio',
      sistema: true
    });
    const newVariable = await variable.save();
    res.send(newVariable);
  } catch (error) {
    res.send({ message: error.message });
  }
};

//Obtener variables web

exports.obtenerVariables = async (req, res) => {
  try {
    //Revisar el ID
    let variables = await Variable.findOne({type:'variables-web'})

    //Si la solicitud existe o no
    if (!variables) {
      return res.status(404).json({ msg: "No hay variables definidas" });
    }
    res.json({variables});
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

//Actualizar variables web

exports.updateVariables = async (req, res) => {
  try{
    const userId = req.body.userInfo._id;
    const user = await User.findById(userId);
    const variable = await Variable.findOne({type:'variables-web'})
    
    if(!user.isAdmin){
      res.status(404).send({ message: 'Permisos no validos' });
    }
    if(variable){
      let updatedVariable = ''
          variable.pageName = req.body.pageName || variable.pageName,
          variable.titleHeader = req.body.titleHeader || variable.titleHeader,
          variable.descriptionHeader = req.body.descriptionHeader || variable.descriptionHeader,
          variable.backgroundHeader = req.body.backgroundHeader || variable.backgroundHeader,
          variable.logoHeader = req.body.logoHeader || variable.logoHeader,
          variable.carouselImg1 = req.body.carouselImg1 || variable.carouselImg1,
          variable.carouselImg2 = req.body.carouselImg2 || variable.carouselImg2,
          variable.carouselImg3 = req.body.carouselImg3 || variable.carouselImg3,
          variable.ubicacion = req.body.ubicacion || variable.ubicacion,
          variable.telefono = req.body.telefono || variable.telefono,
          variable.slogan = req.body.slogan || variable.slogan,
          variable.sistema = variable.sistema,
          variable.emailweb = req.body.emailweb || variable.emailweb,
          variable.descuento = req.body.descuento || variable.descuento,
          updatedVariable = await variable.save();
          res.send({
            pageName: updatedVariable.pageName,
            titleHeader: updatedVariable.titleHeader,
            descriptionHeader: updatedVariable.descriptionHeader,
            backgroundHeader: updatedVariable.backgroundHeader,
            logoHeader: updatedVariable.logoHeader,
            carouselImg1: updatedVariable.carouselImg1,
            carouselImg2: updatedVariable.carouselImg2,
            carouselImg3: updatedVariable.carouselImg3,
            ubicacion: updatedVariable.ubicacion,
            telefono: updatedVariable.telefono,
            slogan: updatedVariable.slogan,
            sistema: updatedVariable.sistema,
            emailweb: updatedVariable.emailweb,
            descuento: updatedVariable.descuento
          }); 
    }
                    
}
  catch(err) {
    res.status(404).send({ message: 'Error al modificar variables' });
  }
  
};
      
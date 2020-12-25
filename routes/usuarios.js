//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const auth = require("../middleware/auth");
const {check} = require('express-validator');

//Crear un usuario
// api/usuarios
router.get('/', 
 auth,
usuarioController.obtenerUsuarios);

router.post('/', 
 auth,
[
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}),
    check('departamento', 'El departamento es obligatorio').not().equals('Seleccione departamento')
], 
usuarioController.crearUsuario);

//Actualizar usuarios via ID
router.put(
    "/:id",
    auth,
    [
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    usuarioController.actualizarUsuario
  );
  
  //Eliminar un proyecto
  //Actualizar solicitudes via ID
  router.delete(
      "/:id",
      auth,
      usuarioController.eliminarUsuario
    );
module.exports = router;
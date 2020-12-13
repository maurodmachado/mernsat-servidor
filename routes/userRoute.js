
const {isAdmin} = require('../util')
const {isAuth} = require('../util')
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/userController')


//Api usuarios

//UPDATE VARIABLES
router.put('/variables', isAdmin, usuarioController.updateVariables);

//LISTAR VARIABLES

router.get('/variables', usuarioController.obtenerVariables)

//UPDATE
router.put('/:id', isAuth, usuarioController.updateUser);

//LOGIN
router.post('/signin', usuarioController.signInUser);

//REGISTRO
router.post('/register', usuarioController.registerUser);

//RECUPERAR PASS
router.post('/recovery', usuarioController.recoveryPassUser);

//CREATE ADMIN
router.get('/createadmin', usuarioController.createAdmin);

//CREATE VARIABLES
router.get('/createvariables', usuarioController.createVariables)


module.exports = router;


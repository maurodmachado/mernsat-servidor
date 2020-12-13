const { isAuth } = require('../util');
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoryController')

//Api productos

//CREAR CATEGORIA
router.post('/', isAuth, categoriaController.crearCategoria);

//LISTAR CATEGORIAS
router.get('/', categoriaController.obtenerCategorias);

//LISTAR CATEGORIA
router.get('/:id',categoriaController.getCategoria); 

//UPDATE CATEGORIA
router.put('/:id', isAuth, categoriaController.updateCategoria);

//DELETE CATEGORIA

router.delete('/:id', isAuth, categoriaController.deleteCategoria);

module.exports = router;

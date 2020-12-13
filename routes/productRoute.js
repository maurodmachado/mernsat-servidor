const { isAuth } = require('../util');
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productController')

//Api productos

//CREAR PRODUCTO
router.post('/', isAuth, productoController.crearProducto);

//LISTAR PRODUCTOS
router.get('/', productoController.obtenerProductos);

//OBTENER PRODUCTO
router.get('/:id',productoController.getProducto); 

//UPDATE PRODUCTO
router.put('/:id', isAuth, productoController.updateProducto);

//DELETE PRODUCTO
router.delete('/:id', isAuth, productoController.deleteProducto);

//CREAR REVIEW
router.post('/:id/reviews', isAuth, productoController.crearReview);

module.exports = router;


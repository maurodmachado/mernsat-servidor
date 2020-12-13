const Product = require('../models/productModel');

//Crear producto

exports.crearProducto = async (req, res) => {
    try {
      
        if(!req.user.isAdmin){
          res.status(500).send({ message: ' Permisos no válidos' });
        }
            const product = new Product({
              name: req.body.name,
              price: req.body.price,
              image: req.body.image,
              brand: req.body.brand,
              category: req.body.category,
              countInStock: req.body.countInStock,
              description: req.body.description,
              isInOffer: req.body.isInOffer,
              rating: req.body.rating,
              numReviews: req.body.numReviews,
            });
            const newProduct = await product.save();
            if (newProduct) {
              res.send({
                _id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                image: newProduct.image,
                brand: newProduct.brand,
                category: newProduct.category,
                countInStock: newProduct.countInStock,
                description: newProduct.description,
                isInOffer: newProduct.isInOffer,
                rating: newProduct.rating,
                numReviews: newProduct.numReviews,
              });
               
            }else{
            res.status(500).send({ message: ' Error al crear producto.' });
            }
           
          
         } catch (error) {
      res.status(500).send("Hubo un error al crear producto");
    }
  };     

//Delete producto
exports.deleteProducto = async (req, res) => {
    try {
      if(!req.user.isAdmin){
        res.status(500).send({ message: ' Permisos no válidos' });
      }
        const deletedProduct = await Product.findById(req.params.id);
        if (deletedProduct) {
          await deletedProduct.remove();
          res.send({ message: 'Producto eliminado' });
        } else {
          res.send('Error al borrar producto.');
        }
         } catch (error) {
      res.status(500).send("Hubo un error al eliminar producto");
    }
  };  


//Obtener productos

exports.obtenerProductos = async (req, res) => {
  try {
    
    const category = req.query.category ? { category: req.query.category } : {};
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
      let sortOrder = '';
      if(req.query.sortOrder === 'marca'){
        sortOrder = {brand:1}
      }else if(req.query.sortOrder === 'highest'){
        sortOrder = { price: -1 }
      }else if(req.query.sortOrder === 'lowest'){
        sortOrder = { price: 1 }
      }else{
        sortOrder = { _id: -1 }
      }
    
    const products = await Product.find({ ...category, ...searchKeyword }).sort(
      sortOrder
    );
    await res.send(products);
  } catch (error) {
    res.status(500).send("Hubo un error al obtener productos");
  }
};

//Obtener producto

exports.getProducto = async (req, res) => {
    try {
            const product = await Product.findOne({ _id: req.params.id });
            if (product) {
              res.send(product);
            } else {
              res.status(404).send({ message: 'Product Not Found.' });
            }
         } catch (error) {
      res.status(500).send("Hubo un error al obtener producto");
    }
  };

  //Actualizar producto

exports.updateProducto = async (req, res) => {
    try {
      if(!req.user.isAdmin){
        res.status(500).send({ message: ' Permisos no válidos' });
      }
        const productId = req.params.id;
    
        const product = await Product.findById(productId);
        if (product) {
          product.name = req.body.name;
          product.price = req.body.price;
          product.image = req.body.image;
          product.brand = req.body.brand;
          product.category = req.body.category;
          product.countInStock = req.body.countInStock;
          product.description = req.body.description;
          {req.body.isInOffer === false ? product.isInOffer = false : product.isInOffer = true}
          
          const updatedProduct = await product.save();
          if (updatedProduct) {
            return res
              .status(200)
              .send({ message: 'Producto actualizado', data: updatedProduct });
          }
        }else{
            return res.status(500).send({ message: ' Error al actualizar producto.' });
        }
        
         } catch (error) {
      res.status(500).send("Hubo un error al actualizar producto");
    }
  };

   //Crear review producto

exports.crearReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        name: req.body.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        message: 'Review saved successfully.',
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
         } catch (error) {
      res.status(500).send("Hubo un error al crear review de producto");    
    }
  };

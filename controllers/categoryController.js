const Category = require('../models/categoryModel');

//Crear categoria

exports.crearCategoria = async (req, res) => {
    try {
           
        if(!req.user.isAdmin){
          
          res.status(500).send({ message: ' Permisos no válidos' });
        }
        
            const category = new Category({
              name: req.body.name,
              description: req.body.description,
            });
            const newCategory = await category.save();
            if (newCategory) {
              res.send({
                _id: newCategory.id,
                name: newCategory.name,
                description: newCategory.description,
              });
               
            }else{
            res.status(500).send({ message: ' Error al crear categoria.' });
            }
           
          
         } catch (error) {
  
           
      res.status(500).send("Hubo un error al crear categoria");
    }
  };     

//Delete categoria
exports.deleteCategoria = async (req, res) => {
    try {
      if(!req.user.isAdmin){
        res.status(500).send({ message: ' Permisos no válidos' });
      }
        const deletedCategory = await Category.findById(req.params.id);
        if (deletedCategory) {
          await deletedCategory.remove();
          res.send({ message: 'Categoria eliminada' });
        } else {
          res.send('Error al borrar categoria.');
        }
         } catch (error) {
      res.status(500).send("Hubo un error al eliminar categoria");
    }
  };  


//Obtener categorias

exports.obtenerCategorias = async (req, res) => {
    try {
        //Buscamos las categorias
        let categorias = await Category.find();
    
        //Si las categorias existen o no
        if (!categorias) {
          return res.status(404).json({ msg: "No hay categorias cargadas" });
        }
    
        
        res.json({categorias});
      } catch (error) {
        res.status(500).send("Hubo un error");
      }
};

//Obtener categoria

exports.getCategoria = async (req, res) => {
    try {
            const category = await Category.findOne({ _id: req.params.id });
            if (category) {
              res.send(category);
            } else {
              res.status(404).send({ message: 'Category Not Found.' });
            }
         } catch (error) {
      res.status(500).send("Hubo un error al obtener categoria");
    }
  };

  //Actualizar categoria

exports.updateCategoria = async (req, res) => {
    try {
      if(!req.user.isAdmin){
        res.status(500).send({ message: ' Permisos no válidos' });
      }
        const categoryId = req.params.id;
    
        const category = await Category.findById(categoryId);
        if (category) {
        category.name = req.body.name;
        category.description = req.body.description;
          const updatedCategory = await category.save();
          if (updatedCategory) {
            return res
              .status(200)
              .send({ message: 'Categoria actualizada', data: updatedCategory });
          }
        }else{
            return res.status(500).send({ message: ' Error al actualizar categoria.' });
        }
        
         } catch (error) {
      res.status(500).send("Hubo un error al actualizar categoria");
    }
  };
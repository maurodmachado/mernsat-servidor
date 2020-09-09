const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')


exports.autenticarUsuario = async (req, res) => {
    
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()})
    }

    //Extraer usuario y password
    const {usuario, password} = req.body;

    try {
        //Revisar que el usuario este registrado
        let user = await Usuario.findOne({usuario})
        
        if(!user){
            return res.status(400).json({ msg: 'El usuario no existe'})
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, user.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password incorrecta'})
        }
        //Crear y firmar JWT
        const payload = {
            user: {
                id: user.id
            }
        };
        //Firmar JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({ token});
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

//Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }

}
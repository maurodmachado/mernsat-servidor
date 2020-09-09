const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    },
    departamento: {
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = mongoose.model('Usuario', UsuariosSchema);
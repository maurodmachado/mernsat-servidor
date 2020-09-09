const mongoose = require('mongoose');

const SolicitudesSchema = mongoose.Schema({
    nombre_solicitante: {
        type: String,
        required: true,
        trim: true
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    departamento: {
        type: String,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        required: true,
        default: false
    }
})
module.exports = mongoose.model('Solicitudes', SolicitudesSchema);
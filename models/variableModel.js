const mongoose = require('mongoose');

const VariablesSchema = mongoose.Schema({
    type: {type:String, required: true},
    pageName: { type: String, required: true },
    titleHeader: { type: String, required: true },
    descriptionHeader: { type: String, required: true },    
    backgroundHeader: { type: String, required: true },    
    logoHeader: { type: String, required: true },    
    carouselImg1: { type: String, required: true },    
    carouselImg2: { type: String, required: true },
    carouselImg3: { type: String, required: true },
    ubicacion: { type: String, required: true },    
    telefono: { type: Number, required: true },    
    emailweb: { type: String, required: true },
    slogan: { type: String, required: true },
    descuento: { type: Number, required: true },    
    sistema: { type: Boolean, required: true },
})

module.exports = mongoose.model('Variable', VariablesSchema);
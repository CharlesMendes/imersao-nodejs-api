const Mongoose = require('mongoose');

class CarroModel {
    static getModel() {
        // para trabalhar com mongoose, precisamos definir
        // nossos Schemas (nosso mapeamento da base de dados)
        const carroSchema = new Mongoose.Schema({
            placa: {
                type: String,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            },
            ano: {
                type: Number,
                required: true
            },
            nome: {
                type: String,
                required: true
            }
        });

        // Definimos um model collection para nosso documento
        const carroModel = Mongoose.model('carros', carroSchema);

        return carroModel;
    }
}

module.exports = CarroModel;

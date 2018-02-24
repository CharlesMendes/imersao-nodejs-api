// Para trabalhar com modelo validados vamos usar o ODM (Object Data Modeling) Mongoose
// validar nossos objetos e criar modelso para esses objetos
// para instalar o mongoose
// npm i --save mongoose

// para colocar um whatcher -> qualquer alteração
// no codigo, ao Ctrl+S
// ele reinicia a apicacao
// passamos o -g pois é uma lib global
// npm i -g nodemon
// nodemon nomeDoArquivo.js
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/concessionaria');

// para guardar a isntancia usaos a connection
// para entender quando o banco é conectado
const connection = Mongoose.connection;

connection.once('open', () => console.log('Base de dados, conectada'));
connection.once('error', () => console.error('Não foi possível conectar'));

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

// criamos um objeto carros
const carros = new carroModel({
    placa: 'EYW-7594',
    ano: 2012,
    nome: 'FOX'
});

carros.save()
    .then(result => console.log('result', result))
    .catch(erro => console.error('erro', erro));
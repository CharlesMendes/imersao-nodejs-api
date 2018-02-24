// importar a lib do mongodb
const MondoDB = require('mongodb');

(async () => {
    // conectamos com o mongo
    const connection = await MondoDB.connect('mongodb://localhost:27017');

    // informamos a base de dados
    const db = connection.db('concessionaria');
    const collection = db.collection('carros');
    // retornar todos os elementos da lista
    const result = await collection.find().toArray();

    // recuperar o primeiro elemento da lista
    // const result = await collection.findOne();

    console.log('resultado: ', result);
})();

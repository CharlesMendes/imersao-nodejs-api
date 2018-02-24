/*
    1º lembrar de criar as pastas em:
    /data/db ou c:/data/db

    2º usamos o comando mongod para inicializar o servidor 
    mongod (e deixamos em uma aba separada no terminal)

    3º usamos o comando mongo para conectar na base de dados

    > show dbs -> lista todos os bancos da maquina local
    > use concessionaria -> caso não exista será inserido
    > show collections -> todas as coleções de uma base
    > db.carros.insert({}) -> cria um novo documento, caso a collection 
    não exista ele cria e insere os dados  (MUITO cuidado ao digitar o nome)
    > db.carros.find ({}) -> usamos para listar os itens

    - para listar os dados mais bonitos, adicionamos o .pretty() ao fim do comando
    db.carros.find().pretty()
*/

// Criamos uma coleção para incluir novas propriedades e valores
for (let i = 0; i <= 1000; i++) {
    db.carros.insert({
        placa: `a${i}b${i * 2}`,
        insertDate: new Date(),
        valor: 100.01
    });
}

// para filtrar os dados, adicionamos ao comando  find dentro do seu objeto
db.carros.find({
    placa: 'a0b0'
}).pretty()

//para limitar os resultados, usamos o comando limit, e o skip pula os primeiros 3 registros:
db.carros.find().skip(3).limit(100).pretty()

// SELECT * FROM carros WHERE placa LIKE 'a%' and placa LIKE '%b100'
db.carros.find({
    $and: [
        { placa: { $regex: '.a*' } },
        { placa: { $regex: '.*b100.' } }
    ]
})

// para projetar (trazer apenas os campos necessarios)
// devemos passar um secundo parametro:
// campo: (1 para mostrar, 0 para ocultar)
db.carros.find({
    $and: [
        { placa: { $regex: '.a*' } },
        { placa: { $regex: '.*b100.' } }
    ]
}, {
        placa: 1,
        _id: 0
    }
).pretty()

// para ordenar nossos resultados, usamos o .sort(), passando
// o campo, e o valor
//.sort({placa: -1})
db.carros.find(
    {
        $and: [
            { placa: { $regex: '.a*' } },
            { placa: { $regex: '.*b100.' } }
        ]
    }, {
        placa: 1,
        _id: 0
    }).sort({ placa: -1 }
    ).pretty()

// para fazer o update:
// 1º parametro é o where
// 2º parametro sao os dados que precisam ser alterados
db.carros.find({
    placa: 'b100a2'
}).pretty()

// quando fazemos update no mondodb, por default, ele substitui todas as propriedades
// pelo valor informado
db.carros.update(
    {},
    { placa: 'b100a2' }
)

// $set modifica apenas os campos informados
// na query (se esquecer, ferrou, vai perder o resto)
db.carros.update(
    {},
    { $set: { valor: '200' } }
)

// total de documentos na collection
db.carros.count();

// retorna apenas o primeiro elemento da collection
db.carros.findOne().pretty();

// apaga a collection inteira
db.carros.remove({})

// para aletar varios itens de uma vez, usamos a flag multi: true
db.carros.update(
    {},
    { $set: { valor: '400' } },
    { multi: true }
)

// para alterar ou inserir dados, colocamos a flag upsert: true
db.carros.update(
    { placa: 'aa22' },
    { $set: { insertDate: new Date(), valor: '500' } },
    { upsert: true }
)

// para pesquisar itens pelo id, lembrar de adicionar o ObjectId
db.carros.findOne({ _id: ObjectId('5a882e1cd1a8160d67c47b1e') })

// para remover itens da base:
// Obs: se enviar o remove com {} ele é multi:true por padrão, ou seja, irá remover tudo
// mas se o where for informado e trazer mais de um resultado, ele é multi: false (remove o primeiro item)
db.carros.remove({ placa: 'a22' })
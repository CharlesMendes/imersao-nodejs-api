#!usr/bin/env node
// adicionamos a linha acima para executar nosso programa
// como um executável do linux, ex:
// ./cli.js --somaDosAnos

// Adicionamos o commander para trabalhar com linhas de comando
// instalamos com o 
// npm install --save commander
// --save para registrar as dependencias e o nome do modulo

// importamos o nosso modulod e dados
// diferente de modulos nativos (ou libs)
// quando imporatmos um modulo nosso
// é necessário passar o ./
const DatabaseFile = require('./DatabaseFile');

// importamos nossa clase de banco do mongo
const DatabaseCrud = require('./databaseMongooseModelCrud');

// importamos nosso modelo de dados
const Carro = require('./ent/carro');

// importamos o commander
const Commander = require('commander');

Commander
    // Informamos a versão do nosso programa
    .version('v1.0')
    // informamos a forma com que esse comando será chamado
    // -n -> APELIDO
    // --nome -> Nome Completo
    .option('-n, --nome [valor]', 'Receber um nome')
    .option('-a, --ano [valor]', 'Receber o ano')
    .option('-p, --placa [valor]', 'Receber a placa')
    .option('-c, --cadastrar [valor]', 'Cadastrar um Carro')
    .option('-u, --atualizar [valor]', 'Atualizar um Carro')
    .option('-l, --listar', 'Listar todos os Carros')
    .option('-o, --obterPorId [valor]', 'Obter um carro por Id')
    .option('-r, --remover', 'Remover um carro')
    .option('-d, --carrosDoAno', 'Listar todos os Carros do ano')
    .option('-s, --somaDosAnos', 'Soma de todos os anos')
    .option('-q, --quantidadePorAno', 'Quantidade por ano')

    // Parseamos os valores que vierem do terminal
    .parse(process.argv);

// Capturamos o resultado
// node cli.js  -n "Charles"
//console.log('resultado: ', Commander.name);

// criamos uma função que se auto executa
(async () => {

    const item = new Carro(Commander);

    // caso o usuário digitar o -cadastrar, realizará o cadastro
    if (Commander.cadastrar) {
        await DatabaseCrud.cadastrar(item);

        console.log('Carro cadastrado com sucesso');
        // para forçar o encerramento da aplicação
        // informamos ao SO que concluiu com exito
        process.exit(0);
        return;
    }

    if (Commander.listar) {
        const resultado = await DatabaseCrud.listar(item);

        console.log('carros:', resultado);
        process.exit(0);
        return;
    }

    if (Commander.atualizar) {
        const nomeAntigo = Commander.atualizar;
        const resultado = await DatabaseCrud.atualizar(nomeAntigo, item);

        console.log(`O ${nomeAntigo} foi atualizado para ${item.nome} com sucesso!`);
        process.exit(0);
        return;
    }

    if (Commander.remover) {
        const resultado = await DatabaseCrud.remover(item);

        console.log('resultado: ', resultado);
        process.exit(0);
        return;
    }

    if (Commander.obterPorId) {
        const resultado = await DatabaseCrud.obterPorId(Commander.obterPorId);

        console.log(`O caso selecionado é: ${resultado}`);
        process.exit(0);
        return;
    }

    if (Commander.carrosDoAno) {
        const resultado = databaseFile.carrosDoAno(ano);
        console.log(`Os carro do Ano ${ano} são ${JSON.stringify(resultado)}`);
        return;
    }

    if (Commander.somaDosAnos) {
        // Do array retornado pelo Aggregate, pegamos somente a primeira
        // posição, e da primeira posição pegamos o total apenas
        const [{ total }] = await DatabaseCrud.somaDosAnos();

        console.log(`A soma de todos os anos é: ${total}`);
        process.exit(0);
        return;
    }

    if (Commander.quantidadePorAno) {
        const resultado = await DatabaseCrud.quantidadePorAno();
        const mensagem = resultado
            .map(item => {
                return `\n Ano: ${item.ano} - Total: ${item.total}`;
            })
            .join();

        console.log('resultado: ', mensagem);
        process.exit(0);
        return;
    }

})()
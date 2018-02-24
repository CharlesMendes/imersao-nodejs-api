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
    .option('-c, --cadastrar [valor]', 'Cadastrar um Carro')
    .option('-u, --atualizar [valor]', 'Atualizar um Carro')
    .option('-l, --listar', 'Listar todos os Carros')
    .option('-d, --carrosDoAno', 'Listar todos os Carros do ano')
    .option('-s, --somaDosAnos', 'Soma de todos os anos')

    // Parseamos os valores que vierem do terminal
    .parse(process.argv);

// Capturamos o resultado
// node cli.js  -n "Charles"
//console.log('resultado: ', Commander.name);

// criamos uma função que se auto executa
(async () => {
    const databaseFile = new DatabaseFile();

    const { nome, ano } = Commander;

    // caso o usuário digitar o -cadastrar, realizará o cadastro
    if (Commander.cadastrar) {
        databaseFile.cadastrar({ nome, ano });
        console.log('Carro cadastrado com sucesso');
        return;
    }

    if (Commander.listar) {
        const resultado = databaseFile.obterDados();
        console.log('carros:', resultado);
        return;
    }

    if (Commander.atualizar) {
        databaseFile.atualizar(Commander.atualizar, { nomeNovo: nome, anoNovo: ano });
        console.log('Carro atualizado com sucesso');
        return;
    }

    if (Commander.carrosDoAno) {
        const resultado = databaseFile.carrosDoAno(ano);
        console.log(`Os carro do Ano ${ano} são ${JSON.stringify(resultado)}`);
        return;
    }

    if (Commander.somaDosAnos) {
        const resultado = databaseFile.somaDosAnos();
        console.log(`A soma de todos os anos é: ${resultado}`);
        return;
    }

})()
// importamos o Fs, para manipular coisas do sistema operacional
// como arquivos
const fs = require('fs');

class DatabaseFile {
    constructor() {
        this.NOME_ARQUIVO = 'Carros.json';
    }

    obterDados() {
        const exists = fs.existsSync(this.NOME_ARQUIVO)
        if (!exists)
            fs.writeFileSync(this.NOME_ARQUIVO, '[]');

        // Funcoes do FS que tem o sufixo Sync
        // Não são recomendados, na pratica usamos apenas o readFile e convertemos
        // para uma Promise (é um callback por padrao)
        const arquivos = fs.readFileSync(this.NOME_ARQUIVO);
        return JSON.parse(arquivos);
    }

    cadastrar({ nome, ano }) {
        const dados = this.obterDados();
        dados.push({ nome, ano });

        fs.writeFileSync(this.NOME_ARQUIVO, JSON.stringify(dados));
    }

    atualizar(nome, { nomeNovo, anoNovo }) {
        const dados = this.obterDados();

        // filtramos todos os itens que contém o nome conforme o primeiro parametro
        // no filter, recebemos como parametro, uma função com 1 parametro
        // que será invocada a cada iteração
        // para falar que é a condição de filtro, a função deve retornar TRUE
        // RETORNA um novo array
        const dadosFiltrados = dados.filter((dado) => {
            return dado.nome === nome; /// 3 iguais para verificar também o tipo
        });

        //a diferença do Map para o Filter
        // é que o Map pode retornar um objeto modificado
        // ele mantém a quantidade de objetos no array
        const dadosMapeados = dados.map((dado) => {
            if (dado.nome !== nome)
                return dado;

            // para não alterar a instancia do objeto, criamos um novo objeto
            // com os valores que precisamos
            // o ObjectAssign server para criar um novo objeto
            // com as propriedades de um antigo
            // substituindo ou adicionando propriedades novas
            const dadoNovo = Object.assign({}, dado, {
                nome: nomeNovo,
                ano: anoNovo
            });

            return dadoNovo;
        });

        //dados.push([{ nome, ano }]);

        fs.writeFileSync(this.NOME_ARQUIVO, JSON.stringify(dadosMapeados));
    }

    carrosDoAno(ano) {
        const itens = this.obterDados();

        // filtramos todos os itens que contém o nome conforme o primeiro parametro
        // no filter, recebemos como parametro, uma função com 1 parametro
        // que será invocada a cada iteração
        // para falar que é a condição de filtro, a função deve retornar TRUE
        // RETORNA um novo array
        const carros = itens.filter(carro => carro.ano === ano)
            .map(carro => {
                //trazemos apenas o nome deste carro
                return carro.nome;
            });

        return carros;
    }

    somaDosAnos() {
        const itens = this.obterDados();
        // trabalhamos com a função REDUCE
        // é usada para transformar seu array em um único objeto
        // ele recebe 2 parametros:
        // 1º objeto anterior
        // 2º o próximo
        // após a função, passamos um valor default caso não encontre
        const soma = itens
            .map(carro => parseInt(carro.ano))
            .reduce((anterior, proximo) => anterior + proximo);

        return soma;
    }
}

//new DatabaseFile().cadastrar({ nome: 'J6', ano: 2012 });
//console.log('resultado: ', new DatabaseFile().obterDados());

module.exports = DatabaseFile;
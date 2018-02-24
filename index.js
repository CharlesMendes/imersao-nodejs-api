// inicializamos o projeto
// com o comando npm init
// para não responder o wizard
// passamos o -y
class Database {

    /*
    // colocamos a chave static para não precisar
    // instanciar a classe, quando não temos membros
    // de classe podemos chamar direto
    // Database.listarUsuarios()
    static listarUsuarios(callback) {

        setTimeout(function() {
            const usuarios = ['Charles', 'Chili', 'Vagnao', 'Brian', 'Isabelli'];

            // por padrão, quando trabalhamos com callbacks
            // passamos null como primeiro parametro -> sucesso
            // e quando bugggg -> (erro, null)
            return callback(null, usuarios);

        }, 2000);
    }

    // por convenção, colocamos o callback sempre no fim
    // como ultimo argumento
    static detalheUsuario(nome, callback) {
        setTimeout(() => {

            // quando temos uma variável com o mesmo nome
            // não precisamos passar seu valor
            return callback(null, {nome, idade: 15, data: new Date() });
        }, 1000);
    }
    */

    static listarUsuarios() {
        // Promise
        // -> sucesso -> retorna um objeto na função .then
        // -> erro -> retorna um objeto na função .catch

        // usamos dois parametros para a função Promise
        // 1º -> resolve -> Quando finalizar todo o processo, corretamente
        // chama a função resolve, com o resultado
        // 2º -> Caso erro, retorna a exceção com o valor no reject
        const minhaPromise = new Promise((resolve, reject) => {
            setTimeout(function () {
                const usuarios = ['Charles', 'Chili', 'Vagnao', 'Brian', 'Isabelli'];

                return resolve(usuarios);
            }, 2000);
        });

        // nessa etapa do projeto, temos uma Promise com status:
        // PENDING -> não resolveu ainda
        // SUCESS -> Para esperar ele resolver, usamos a função .then
        // ERROR -> Cai no .catch
        return minhaPromise;
    }

    static detalheUsuario(nome) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                if (nome === '1')
                    return reject("Valor Incorreto!");

                return resolve({ nome, idade: 15, data: new Date() });
            }, 1000);
        })
    }
}

class Execucao {
    static async executar() {
        try {
            // assim como nos .then, pegamos e destruimos o array
            // pegando apenas a sua primeira posição
            // é uma técnica chamada de DESTRUCTOR
            // SE a função retornasse um objeto = {nome, idade, cpf}
            // const {cpf} = objeto
            const [val1] = await Database.listarUsuarios();
            const detalhes = await Database.detalheUsuario(val1);
            await Database.detalheUsuario('1');

            console.log('detalhes: ', detalhes);

        } catch (error) {
            console.error('error: ', error);
        }
    }

    static executar2() {
        // para receber o resultado de usuarios
        // devemos passar uma função, que será chamada
        // quando a tarefa for terminada
        /* const resultado = Database.listarUsuarios(function (erro1, resultado1) {
             console.log('resultado: ', resultado1)
 
             Database.detalheUsuario(resultado[0], function (erro2, resultado2) {
                 console.log('resultado: ', resultado2)
             });
         });*/

        //Cada Promise retorna uma promise, 
        // Podemos ter diversas chamadas de promise em nosso projeto
        Database.listarUsuarios()
            // Sabemos que o resultado de listarUsuarios é um array
            // logo, as primeiras posições tem pelo menos 3 argumentos
            // extraimos cada elemento em uma variável separada
            // caso tivesse 1000 itens, retornaria somente os 3
            .then(([val1, val2, val3]) => val1)
            .then(val1 => Database.detalheUsuario(val1))
        // a funcao .then recebe um unico parametro
        // caso nossa função desejar 


        /*
        // Cada Promise retorna uma promise, 
        // Podemos ter diversas chamadas de promise em nosso projeto
        .then(resultado => {

            console.log('lista: ', resultado)

            Database.detalheUsuario(resultado[0], function (erro2, resultado2) {
                console.log('detalhes: ', resultado2)
            });
        }).catch(error => {})
        */
    }
}

Execucao.executar();
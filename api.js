/*
const http = require('http');
http
    .createServer((request, response) => {
        response.end('#VaiCorinthians');
    })
    .listen(3000, () => {
        console.log('Servidor rodando...');
    });
*/

// instalamos o Hapi para manipular rotas e construção da REST
// npm install --save hapi@15

/* Padrão REST:
   -> não guardar estado - Sessão é o kct
   -> Cadastrar -> CREATE
   -> /produtos/ -> HTTP POST

   -> Atualizar -> PUT para o objeto inteiro ou PATH para objeto parcial
   -> /produtos/id
      body: { nome: 'teste a' }
    
   -> Remover -> DELETE
   -> /produtos/id

   -> Listar -> GET
   -> /produtos/id

   produtos > varias categorias = pegar o detalhe de uma categoria
   /produtos/id/categoria/idCategoria -> GET

*/

/* 23/02
Instalar autenticação:
npm i --save hapi-auth-jwt2 jsonwebtoken

Instalamos 2 libs para trabalhar com jwt:
- jsonwebtoken -> lib padrão para controle de seus tokens
- hapi-auth-jwt2 -> é a abstração (plugin do HAPI), para validar nossos tokens nas rotas

para descriptografar no modo HACKERZAO:
> const jwt = require(‘jsonwebtoken’)

Criptografar
> jwt.sign({dado: 1}, 'minha_senha_forte')
será gerado um token

Descriptografar
> new Buffer(token, ‘base64’).toString()
Devolve a token descritografada

Passos:
 1) registrar os plugins
 2) registrar a função de validação de token
 3) adicionar as rotas com nossas validações
    -> config = {auth: 'jwt'}
    -> rotas publicas = {auth: false}

 4) definir que o jwt é padrão para as rotas

  - Instalamos o hapi-swagger, para a documentação de nossas APIs
  - Para gerar um gront end com todas as integrações, instalamos o Vision e o Inert

  npm i --save inert@4 vision@4 hapi-swagger@7
  1) registrar os plugins
  2) adicionar configurações as rotas:
     config:{
         notes: 'pequena descricao',
         description: 'descricao completa',
         //nao esquecer
         tags: ['api']
     }
*/

/* 24/02
Criamos dois arquivos para trabalhar com diversos ambientes config:
.env.dev
.env.prod

removemos todas as strings sensiveis da apliação e concentramos em um só lugar
para visualiar todas as variáveis de ambiente no Node.js:
λ node
> process.env

para adicionar nossas variáveis customizadas ao ambiente, instalamos o pacote "dotenv"
> npm i --save doetnv

Instalamos o paote pm2, para gerenciar nossos recursoso da aplicação, caso ocorra alguma exceção ele 
reiniciará e gerenciará a aplicação para nós
> npm i --g pm2

http://pm2.keymetrics.io/
> pm2 start nomearquivo.js
> pm2 logs nomearquivo
> pm2 list
> pm2 stop nomearquivo
> pm2 kill -> encerrar o processo do pm2
> pm2 monit nomearquivo
> pm2 start --name api-carros api.js -i max | quantidade
> pm2 scale api 10

no package.json, adicionamos scripts de execução da nossa aplicação
para o servidor saber qual é o ambiente que deve trabalhar


instalamos o heroku toolbelt => cli
criamos uma conta no heroku
heroku login ou heroku auth:login
git init => nesse caso nosso repositorio ainda nao era um git
criamos o .gitignore com os arquivos que devem ser ignorados
adicionamos o script de pre install no package json

criamos um arquvo ProcFile com os comandos que o heroku deve rodar para nossa aplicação funcionar

web: web tem vida curta, dependendo do request ele morre para economizar energia
worker: jobs, cron, programas que executam periodicamente

nesse momento adicionou a origin para visualizar as origins 
> heroku apps:create nomeDaApi
> git add . && git commit -m "mensagem"
> git push heroku master
> git 


heroku run bash
heroku logs -t

*/

/*
gerenciamento de logs
https://github.com/winstonjs/winston
> npm i --save winston
*/
const winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/debug.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});

const logInfo = req =>
    logger.info(`method: ${req.method}, path: ${req.path}, origem: ${req.info.remoteAddress}`);

const logError = (req, error) =>
    logger.error(`method: ${req.method}, path: ${req.path}, origem: ${req.info.remoteAddress}, mensagem: ${error}`);

// importamos o dotenv
const { config } = require('dotenv');
if (process.env.NODE_ENV === 'production')
    config({ path: './config/.env.prod' });
else
    config({ path: './config/.env.dev' });

console.log('MONGO_URL', process.env.MONGO_URL);

const Hapi = require('hapi');


// instalamos o CORS para liberar acessos a uso externo
// npm i --save hapi-cors
const HapiCors = require('hapi-cors');
const HapiJwt = require('hapi-auth-jwt2');
const Jwt = require('jsonwebtoken');

// instalamos o JOI para validar todos os nossos requests
// npm i --save joi
const Joi = require('joi');

// instalamos o BOOM para manipular erros de HTTP Status
// npm i --save boom
const Boom = require('boom');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const Carro = require('./ent/carro');
const KEY = process.env.KEY_JWT;

const USUARIO_VALIDO = {
    email: 'xuxadasilva@xuxa.org',
    senha: 1234
};

(async () => {

    try {
        const Database = require('./databaseMongooseModelCrud');

        const app = new Hapi.Server();
        app.connection({ port: process.env.PORT });

        await app.register({
            register: HapiCors,
            options: {
                origins: ["*"],
                methods: ["GET", "POST", "PATCH", "DELETE"]
            }
        });

        // registramos o swagger
        await app.register([
            Inert,
            Vision,
            {
                register: HapiSwagger,
                options: {
                    info: { version: "v1.0", title: "API de Carros" },
                    documentationPath: "/docs"
                }

            }
        ]);

        // registramos o json web token
        await app.register(HapiJwt);

        // criamos uma estratégia de autenticação
        app.auth.strategy('jwt', 'jwt', {
            key: KEY,
            //antes de qualquer requisição esse método é
            // chamado para validar seu token
            validateFunc: (tokenDescriptografado, request, callback) => {
                // aqui podemos fazer validações customizadas
                return callback(null, true);
            },
            verifyOptions: { algorithms: ["HS256"] }
        });

        app.auth.default('jwt');

        // definimos as rotas para a aplicação
        app.route([
            {
                method: 'POST',
                path: '/login',
                handler: (req, reply) => {

                    logInfo(req);

                    const { email, senha } = req.payload;

                    if (USUARIO_VALIDO.email.toLowerCase() !== email.toLowerCase() || USUARIO_VALIDO.senha !== senha)
                        return reply(Boom.unauthorized());

                    // geramos um token de acesso, para o usuário logado com o tempo de expiração 12horas
                    const token = Jwt.sign({ usuario: email }, KEY, { expiresIn: "12h" });
                    return reply({ token });
                },
                config: {
                    auth: false, //desativamos a autenticação para esse método
                    notes: 'Login',
                    description: 'Autenticação do usuário',
                    tags: ['api'],
                    validate: {
                        payload: {
                            email: Joi.string()
                                .email()
                                .required()
                                .default('xuxadasilva@xuxa.org'),
                            senha: Joi.number()
                                .required()
                        }
                    }
                }

            },
            {
                method: 'GET',
                path: '/carros',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        //console.error('DEU RUIM', error);
                        //return reply('Erro interno manooooo').statusCode = 500;
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Pesquisar Carro',
                    description: 'Retorna os carros localizados',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            nome: Joi.string()
                                //.required()
                                .min(2)
                                .max(10),
                            limit: Joi.number()
                                .max(100)
                                .default(10),
                            skip: Joi.number()
                                .default(0)
                        }
                    }
                }
            },
            {
                method: 'POST',
                path: '/carros',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const { payload } = req;
                        const carro = new Carro(payload);
                        const resultado = await Database.cadastrar(carro);

                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        //console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Cadastrar Carro',
                    description: 'Criação de um novo carro',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        // validar as querystrings parametros na url 
                        // -> query

                        // validar os parametros que vem no padrao
                        // -> params
                        // produtos/{id} = param

                        // validar o corpo da requisição
                        // payload

                        // validar o token no header
                        // headers

                        payload: {
                            ano: Joi.number().required(),
                            nome: Joi.string()
                                .min(2)
                                .max(100)
                                .required(),
                            placa: Joi.string()
                                .max(8)
                                .required()
                        }
                    }
                }
            },
            {
                method: 'PATCH',
                path: '/carros/{id}',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const { id } = req.params;
                        const { payload } = req;
                        const carro = new Carro(payload);

                        // fizemos uma pequena gambiarra
                        // removemos as propriedades que estiverem  
                        // com null, caso o usuario nao as envie nao cadastramos
                        Object.keys(carro).map(key => {
                            if (carro[key]) return key;
                            delete carro[key];
                        });

                        const resultado = await Database.atualizar(id, carro);

                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        //console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Atualizar Carro',
                    description: 'Atualizar um carro carro existente',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        params: {
                            id: Joi.string()
                        },
                        payload: {
                            ano: Joi.number(),
                            nome: Joi.string()
                                .min(2)
                                .max(100),
                            placa: Joi.string()
                                .max(8)
                        }
                    }
                }
            },
            {
                method: 'DELETE',
                path: '/carros/{id}',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const { id } = req.params;
                        const resultado = await Database.remover(id);

                        return reply(resultado);

                    } catch (error) {
                        console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Remover um Carro',
                    description: 'Remove um carro carro existente',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        params: {
                            id: Joi.string()
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/carros/{id}',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const { id } = req.params;
                        // por baixo dos panos, o Hapi resolve a promise
                        // caso não precisar reutilizar o valor que veio da promise
                        // não precisa passar o await
                        //const resultado = await Database.obterPorId(id);
                        const resultado = Database.obterPorId(id);

                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        //console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Buscar carro por ID',
                    description: 'Detalhes de um carro existente',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        params: {
                            id: Joi.string()
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/carros/relatorios/somadosanos',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const [{ total }] = await Database.somaDosAnos();
                        return reply({ total });

                    } catch (error) {
                        logError(req, error);
                        //console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Relatorio - Soma dos Anos',
                    description: 'Retorna relatório de Soma dos Anos',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'GET',
                path: '/carros/relatorios/quantidadeporano',
                handler: async (req, reply) => {
                    try {
                        logInfo(req);
                        const resultado = Database.quantidadePorAno();

                        return reply(resultado);

                    } catch (error) {
                        //logError(req, error);
                        console.error('DEU RUIM', error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    notes: 'Relatorio - Quantidade por Ano',
                    description: 'Retorna relatório de Quantidade por Ano',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            }
        ]);

        // inicializamos nossa API
        await app.start();

        console.log('Servidor rodando...MANOWWWWW', process.env.PORT);
    } catch (error) {
        logError(req, error);
        //console.error('erro inesperado', error);
    }

})();
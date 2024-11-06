# API Gerencial

## Descrição

A API Gerencial é uma aplicação backend desenvolvida com AdonisJS 6 e TypeScript, projetada para gerenciar e integrar informações sobre estabelecimentos, terminais, usuários e transações financeiras. Esta API fornece uma interface robusta para operações CRUD e integração com serviços externos, como a plataforma USE e Mesh.

## Funcionalidades

    Autenticação: Sistema de login seguro com suporte a tokens.
    Gestão de Usuários: CRUD completo para usuários do sistema.
    Gestão de Estabelecimentos: CRUD para gerenciar informações de estabelecimentos.
    Gestão de Terminais: Operações para criar, listar e atualizar terminais.
    Transações: Consulta e repasse de recebimentos, integrando com plataformas externas.

## Documentação da API

A documentação da API está disponível em formato Swagger, permitindo visualizar todos os endpoints disponíveis, parâmetros e respostas esperadas. Para acessá-la, basta iniciar a aplicação e navegar até o seguinte endereço: http://localhost:3333/swagger

A documentação foi gerada automaticamente com o uso do **Swagger**, facilitando o entendimento e a utilização da API pelos desenvolvedores.

## Estrutura de Rotas

### As rotas estão organizadas em grupos, cada uma com suas respectivas funcionalidades:

- /api/v1/login: Login de usuário.
- /api/v1/usuarios: CRUD para usuários.
- /api/v1/terminais: CRUD para terminais.
- /api/v1/estabelecimentos: CRUD para estabelecimentos.
- /api/v1/use: Consultas e repasses relacionados ao serviço USE.
- /api/v1/mesh: Integração com a plataforma Zoop.

## Instalação

```
git clone https://gitlab.com/grupo-primavera-interno/api-gerencial.git
cd api-gerencial
npm install
node ace migration:run
node ace db:seed
node ace serve --watch
```

## Uso

Acesse a API através do endpoint base: http://localhost:3333/api/v1.

## Exemplos de Requisições


```
Login:
POST /api/v1/login

Listar Usuários:
`GET /api/v1/usuarios

Criar Terminal:
POST /api/v1/terminais
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir pull requests ou relatar problemas.

## Autores

    Diogo Perez Areco - [text](https://github.com/diogo-perez)

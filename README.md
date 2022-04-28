# Blog (CRUD)

Esse projeto é apenas para fins de estudo. Feito com [JavaScript], [Bootstrap], [nodeJS], [ExpressJs], [Sequelize] e [postgres]

## Conceito de banco de dados relacional

### Tipos de relacionamento

- 1 para 1 -> | Atividade | -> | Pertence | -> | Aula |
- 1 para N -> | Vendedor | -> | Atende | -> | Clientes[] |
- N para N -> | Produto[] | -> | Compra | -> | Notas[] |

links para saber mais: [Oracle](https://www.oracle.com/br/database/what-is-a-relational-database/)

## Estrutura de pastas do projeto (usando arquitetura MVC)

> / controllers -> routes
> / database
> / database/models -> database tables
> / public -> static files
> / views -> pages
> index.js

## Relacionamentos do banco de dados (categorias <-> artigos)

1. Todo artigo pertence á uma categoria (One-to-one)
2. Toda categoria pode ter multiplos artigos (One-to-Many)

# Cookies e sessions

--

### Cookies

Arquivo de texto simples armazenado pelo navegador. Sua função é guardar uma série de informações sobre o visitante e sua navegação, para que sejam utilizados no caso de novo acesso

### Sessions

Sessões geralmente dependem de cookies, mas os dados são guardados no servidor. Funciona assim: Uma sessão é iniciado no servidor, que envia um cookie ao browser com um ID único daquela sessão.

Qualquer dado associado á sessão é armazenado no servidor, associado a esse ID.

Em toda a requisição, o browser envia de volta o cookie com o ID de sessão, o que permite ao servidor dar acesso aos dados associados áquiele ID.

Portanto, usar sessões é um pouco mais seguro que guardar dados diretamente em cookies, já que se alguém tiver acesso ao cookie não tem acesso direto aos dados (isso sem falar que não cabem muitos dados nos cookies)

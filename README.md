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

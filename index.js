const express = require('express') // importing express
const bodyParser = require('body-parser') // importing body-parser
const connection = require('./database/database') // importing database connection

// importing controllers
const CategoriesController = require('./controllers/categories/CategoriesController')
const ArticlesController = require('./controllers/articles/ArticlesController')
const UsersController = require('./controllers/users/UsersController')

//importing models
const Article = require('./database/models/Article')
const Category = require('./database/models/Category')
const User = require('./database/models/User')

const app = express() // loading express

app.use(express.static('public')) // setting the static files folder

app.set('view engine', 'ejs') // setting ejs as view engine

// body parser config
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// function to check if database connection has been established
async function testDatabaseConnection() {
  try {
    await connection.authenticate()
    console.log('Connection has been established successfully')
  } catch (err) {
    console.error('Unable to connect to the database: ', error)
  }
}

// testDatabaseConnection()

app.use('/', CategoriesController)
app.use('/', ArticlesController)
app.use('/', UsersController)

app.get('/', async (request, response) => {
  const limit = 4

  try {
    const articles = await Article.findAndCountAll({
      raw: true,
      include: [
        {
          model: Category,
          required: true,
          attributes: ['title']
        }
      ],
      limit: limit,
      offset: 0
    })

    let hasNextPage = false
    if (articles.count > limit) hasNextPage = true

    const categories = await Category.findAll({
      raw: true,
      order: [['title', 'ASC']]
    })

    response.render('index', {
      articles: articles.rows,
      categories: categories,
      hasNextPage: hasNextPage
    })
  } catch (err) {
    console.log('/\nAn error has occurred: ' + err.message)
  }
})

// running the server on port 3000
app.listen(3000, err => {
  if (err) console.error(err)
  else console.log('Server is running')
})

const express = require('express') // importing express
const bodyParser = require('body-parser') // importing body-parser
const connection = require('./database/database') // importing database connection

// importing controllers
const CategoriesController = require('./controllers/categories/CategoriesController')
const ArticlesController = require('./controllers/articles/ArticlesController')

//importing models
const Article = require('./database/models/Article')
const Category = require('./database/models/Category')

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

app.get('/', async (request, response) => {
  try {
    const articles = await Article.findAll({
      raw: true,
      include: [
        {
          model: Category,
          required: true,
          attributes: ['title']
        }
      ]
    })

    response.render('index', { articles: articles })
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
  }
})

app.use('/admin/categories', CategoriesController)
app.use('/categories', CategoriesController)

app.use('/admin/articles', ArticlesController)
app.use('/articles', ArticlesController)

// running the server on port 3000
app.listen(3000, err => {
  if (err) console.error(err)
  else console.log('Server is running')
})

const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const Article = require('../../database/models/Article')
const Category = require('../../database/models/Category')

router.get('/', async (request, response) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: Category,
          attributes: ['title'],
          required: true
        }
      ],
      raw: true,
      order: [['id', 'ASC']]
    })

    response.render('admin/articles/index', { articles: articles })
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
  }
})

router.get('/new', async (request, response) => {
  try {
    const categories = await Category.findAll({
      raw: true,
      order: [['title', 'ASC']]
    })

    response.render('admin/articles/new', { categories: categories })
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
    response.redirect('/')
  }
})

router.post('/save', async (request, response) => {
  const { title, body, category } = request.body

  try {
    await Article.create({
      title: title,
      slug: slugify(title, {
        replacement: '-',
        trim: true,
        lower: true
      }),
      body: body,
      categoryId: parseInt(category)
    })

    response.redirect('/admin/articles')
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
  }
})

router.post('/delete', async (request, response) => {
  const { id } = request.body

  if (id && !isNaN(id)) {
    try {
      await Article.destroy({ where: { id: id } })

      response.redirect('/admin/articles')
    } catch (err) {
      console.log('An error has occurred ' + err.message)
    }
  } else {
    response.redirect('/admin/articles')
  }
})

module.exports = router

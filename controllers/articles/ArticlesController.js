const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const Article = require('../../database/models/Article')
const Category = require('../../database/models/Category')
const adminAuth = require('../../middlewares/adminAuth')

router.get('/article/:id', async (request, response) => {
  const { id } = request.params

  if (id && !isNaN(id)) {
    try {
      const article = await Article.findByPk(id)
      const categories = await Category.findAll({
        raw: true,
        order: [['title', 'ASC']]
      })

      response.render('article', { article: article, categories: categories })
    } catch (err) {
      console.log('/article/:id\nAn error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/')
  }
})

router.get('/admin/articles/new', adminAuth, async (request, response) => {
  try {
    const categories = await Category.findAll({
      raw: true,
      order: [['title', 'ASC']]
    })

    response.render('admin/articles/new', { categories: categories })
  } catch (err) {
    console.log('/admin/articles/new\nAn error has occurred: ' + err.message)
    response.redirect('/')
  }
})

router.get('/admin/articles', adminAuth, async (request, response) => {
  console.log('vim aqui')

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

    response.render('admin/articles/index', {
      articles: articles
    })
  } catch (err) {
    console.log('/admin/articles\nAn error has occurred: ' + err.message)
  }
})

router.get('/admin/articles/edit/:id', adminAuth, async (request, response) => {
  const { id } = request.params

  if (id && !isNaN(id)) {
    try {
      const article = await Article.findByPk(id, {
        include: [{ model: Category }]
      })
      const categories = await Category.findAll({
        raw: true,
        order: [['title', 'ASC']]
      })

      console.log(article)

      response.render('admin/articles/edit', {
        article: article,
        categories: categories
      })
    } catch (err) {
      console.log('An error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/admin/articles/edit/:id\n/admin/articles')
  }
})

router.get('/articles/page/:num', async (request, response) => {
  let { num } = request.params

  if (num && !isNaN(num)) {
    num = parseInt(num)

    if (num === 1) response.redirect('/')

    const limit = 4
    let offset = (num - 1) * limit
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
        offset: offset
      })

      const categories = await Category.findAll({
        raw: true,
        order: [['title', 'ASC']]
      })

      let hasNextPage = true

      if (offset + limit > articles.count) hasNextPage = false

      console.log(articles.rows)

      response.render('page', {
        articles: articles.rows,
        categories: categories,
        hasNextPage: hasNextPage,
        page: num
      })
    } catch (err) {
      console.log('/articles/page/:num\nAn error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/')
  }
})

router.post('/article/save', adminAuth, async (request, response) => {
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
    console.log('/article/save\nAn error has occurred: ' + err.message)
  }
})

router.post('/article/update', adminAuth, async (request, response) => {
  const { id, newTitle, body, categoryId } = request.body

  try {
    await Article.update(
      {
        title: newTitle,
        slug: slugify(newTitle, {
          replacement: '-',
          trim: true,
          lower: true
        }),
        body: body,
        categoryId: parseInt(categoryId)
      },
      {
        where: {
          id: id
        }
      }
    )

    response.redirect('/admin/articles')
  } catch (err) {
    console.log('/article/update\nAn error has occurred: ' + err.message)
  }
})

router.post('/article/delete', adminAuth, async (request, response) => {
  const { id } = request.body

  if (id && !isNaN(id)) {
    try {
      await Article.destroy({ where: { id: id } })

      response.redirect('/admin/articles')
    } catch (err) {
      console.log('/article/delete\nAn error has occurred ' + err.message)
    }
  } else {
    response.redirect('/admin/articles')
  }
})

module.exports = router

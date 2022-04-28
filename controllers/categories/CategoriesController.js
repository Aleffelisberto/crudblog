const express = require('express')
const slufigy = require('slugify')
const Category = require('../../database/models/Category')
const Article = require('../../database/models/Article')
const adminAuth = require('../../middlewares/adminAuth')

const router = express.Router()

router.get('/admin/categories/new', adminAuth, async (request, response) => {
  response.render('admin/categories/new')
})

router.get('/admin/categories', adminAuth, async (request, response) => {
  try {
    const categories = await Category.findAll({
      raw: true,
      order: [['id', 'ASC']]
    })

    response.render('admin/categories/index', {
      categories: categories
    })
  } catch (error) {
    console.log(error.message)
  }
})

router.get('/category/:slug', async (request, response) => {
  const { slug } = request.params

  if (slug) {
    try {
      const categories = await Category.findAll({
        raw: true,
        order: [['id', 'ASC']]
      })
      const categoryInstance = await Category.findOne({
        where: {
          slug: slug
        },
        include: { model: Article, required: true }
      })
      console.log(categoryInstance.articles)
      response.render('category', {
        categories: categories,
        category: categoryInstance
      })
    } catch (err) {
      console.log('/category/:slug\nAn error has occurred: ' + err.message)
    }
  }
})

router.get(
  '/admin/categories/edit/:id',
  adminAuth,
  async (request, response) => {
    const { id } = request.params

    if (id && !isNaN(id)) {
      try {
        const categoryInstance = await Category.findByPk(id)
        response.render('admin/categories/edit', { category: categoryInstance })
      } catch (err) {
        console.log(
          '/admin/categories/edit/:id\nAn error has occurred: ' + err.message
        )
      }
    } else {
      response.redirect('/admin/categories')
    }
  }
)

router.post('/category/save', adminAuth, async (request, response) => {
  const { title } = request.body

  if (title) {
    const slug = slufigy(title, {
      trim: true,
      replacement: '-',
      lower: true
    })

    try {
      await Category.create({
        title: title,
        slug: slug
      })
      response.redirect('/admin/categories')
    } catch (error) {
      console.log('/category/save\nAn error has occurred: ' + error.message)
    }
  } else {
    response.redirect('admin/categories/new')
  }
})

router.post('/category/delete', adminAuth, async (request, response) => {
  const { id } = request.body

  if (id && !isNaN(id)) {
    try {
      await Category.destroy({ where: { id: id } })
      response.redirect('/admin/categories')
    } catch (error) {
      console.log('/category/delete\nAn error has occurred: ' + error.message)
    }
  } else {
    response.redirect('/')
  }
})

router.post('/category/update', adminAuth, async (request, response) => {
  const { id, newTitle } = request.body

  if (id && !isNaN(id)) {
    try {
      await Category.update(
        {
          title: newTitle,
          slug: slufigy(newTitle, {
            trim: true,
            replacement: '-',
            lower: true
          })
        },
        {
          where: { id: id }
        }
      )

      response.redirect('/admin/categories')
    } catch (err) {
      console.log('/category/update\nAn error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/admin/categories')
  }
})

module.exports = router

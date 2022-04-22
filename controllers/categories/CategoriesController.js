const express = require('express')
const slufigy = require('slugify')
const Category = require('../../database/models/Category')

const router = express.Router()

router.get('/new', async (request, response) => {
  response.render('admin/categories/new')
})

router.get('/', async (request, response) => {
  try {
    const categories = await Category.findAll({
      raw: true,
      order: [['id', 'ASC']]
    })

    response.render('admin/categories/index', { categories: categories })
  } catch (error) {
    console.log(error.message)
  }
})

router.get('/edit/:id', async (request, response) => {
  const { id } = request.params

  if (id && !isNaN(id)) {
    try {
      const categoryInstance = await Category.findByPk(id)
      response.render('admin/categories/edit', { category: categoryInstance })
    } catch (err) {
      console.log('An error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/admin/categories')
  }
})

router.post('/save', async (request, response) => {
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
      console.log('An error has occurred: ' + error.message)
    }
  } else {
    response.redirect('admin/categories/new')
  }
})

router.post('/delete', async (request, response) => {
  const { id } = request.body

  if (id && !isNaN(id)) {
    try {
      await Category.destroy({ where: { id: id } })
      response.redirect('/admin/categories')
    } catch (error) {
      console.log('An error has occurred: ' + error.message)
    }
  } else {
    response.redirect('/')
  }
})

router.post('/update', async (request, response) => {
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
      console.log('An error has occurred: ' + err.message)
    }
  } else {
    response.redirect('/admin/categories')
  }
})

module.exports = router

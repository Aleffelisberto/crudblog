const express = require('express')
const slufigy = require('slugify')
const Category = require('../../database/models/Category')

const router = express.Router()

router.get('/new', async (request, response) => {
  response.render('admin/categories/new')
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
      response.redirect('/')
    } catch (error) {
      console.log('An error has occurred: ' + error.message)
    }
  } else {
    response.redirect('admin/categories/new')
  }
})

module.exports = router

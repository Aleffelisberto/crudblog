const express = require('express')
const router = express.Router()
const User = require('../../database/models/User')
const Category = require('../../database/models/Category')
const bcrypt = require('bcryptjs')
const adminAuth = require('../../middlewares/adminAuth')

router.get('/admin/users', adminAuth, async (request, response) => {
  try {
    const users = await User.findAll({ raw: true, order: [['name', 'ASC']] })
    response.render('admin/users/index', { users: users })
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
    response.redirect('/')
  }
})

router.get('/admin/users/new', adminAuth, async (request, response) => {
  response.render('admin/users/new')
})

router.get('/login', async (request, response) => {
  try {
    const categories = await Category.findAll({
      raw: true,
      order: [['title', 'ASC']]
    })
    response.render('admin/users/login', { categories: categories })
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
    response.redirect('/')
  }
})

router.get('/logout', async (request, response) => {
  request.session.user = null
  response.redirect('/')
})

router.post('/user/save', adminAuth, async (request, response) => {
  const { name, email, password } = request.body

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  try {
    const result = await User.findOne({ where: { email: email } })

    if (result) {
      response.redirect('/admin/users/new')
    } else {
      await User.create({
        name: name,
        email: email,
        password: hash
      })

      response.redirect('/admin/users')
    }
  } catch (err) {
    console.log('/user/save\nAn error has occurred: ' + err.message)
    response.redirect('/')
  }
})

router.post('/authenticate', async (request, response) => {
  const { email, password } = request.body

  try {
    const user = await User.findOne({ where: { email: email } })

    if (user) {
      // password validation
      const isPasswdCorrect = bcrypt.compareSync(password, user.password)
      if (isPasswdCorrect) {
        request.session.user = {
          id: user.id,
          email: user.email
        }

        response.redirect('/admin/articles')
      } else {
        response.redirect('/login')
      }
    } else {
      response.redirect('/login')
    }
  } catch (err) {
    console.log('An error has occurred: ' + err.message)
    response.redirect('/login')
  }
})

module.exports = router

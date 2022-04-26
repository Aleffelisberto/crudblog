const express = require('express')
const router = express.Router()
const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', async (request, response) => {
  response.send('Listagem de users')
})

router.get('/admin/users/new', async (request, response) => {
  response.render('admin/users/new')
})

router.post('/user/save', async (request, response) => {
  const { name, email, password } = request.body

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  try {
    await User.create({
      name: name,
      email: email,
      password: hash
    })
  } catch (err) {
    console.log('/user/save\nAn error has occurred: ' + err.message)
    response.redirect('/')
  }
})

module.exports = router

const express = require('express')
const router = express.Router()

router.get('/', async (request, response) => {
  response.render('index')
})

module.exports = router

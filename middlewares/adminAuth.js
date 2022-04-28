const adminAuth = (request, response, next) => {
  if (request.session.user) {
    next()
  } else {
    response.redirect('/login')
  }
}

module.exports = adminAuth

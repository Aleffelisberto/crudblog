const { Sequelize } = require('sequelize')

module.exports = new Sequelize('crudblogdb', 'postgres', 'Alefalef188300!', {
  host: 'localhost',
  dialect: 'postgres'
})

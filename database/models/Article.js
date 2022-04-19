const { Sequelize } = require('sequelize')
const connection = require('../database')
const Category = require('../models/Category')

const Article = connection.define('articles', {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false },
  body: { type: Sequelize.STRING, allowNull: false }
})

// relationships
Category.hasMany(Article) // One-to-many relationship
Article.belongsTo(Category) // One-to-one relationship

module.exports = Article

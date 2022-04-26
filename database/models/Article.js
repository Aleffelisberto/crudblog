const { Sequelize } = require('sequelize')
const connection = require('../database')
const Category = require('../models/Category')

const Article = connection.define('articles', {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false },
  body: { type: Sequelize.TEXT, allowNull: false }
})

// associations
Category.hasMany(Article, { onDelete: 'cascade' }) // One-to-many association
Article.belongsTo(Category) // One-to-one associoation

module.exports = Article

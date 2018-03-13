const mongoose = require('mongoose')
const Recipe = require('../models/recipe')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    recipes: user.recipes.map(Recipe.format),
    likedRecipes: user.likedRecipes.map(Recipe.format)
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
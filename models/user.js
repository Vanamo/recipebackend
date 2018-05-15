const mongoose = require('mongoose')
const Recipe = require('../models/recipe')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  recipes: [String],
  likedRecipes: [String],
  drawnRecipes: [String]
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    recipes: user.recipes,
    likedRecipes: user.likedRecipes,
    drawnRecipes: user.drawnRecipes
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
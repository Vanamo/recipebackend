const mongoose = require('mongoose')
const Recipe = require('../models/recipe')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  drawnRecipes: [String]
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    recipes: user.recipes.map(r => r._id),
    likedRecipes: user.likedRecipes.map(lr => lr._id),
    drawnRecipes: user.drawnRecipes
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
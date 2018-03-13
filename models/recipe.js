const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

recipeSchema.statics.format = (recipe) => {
  return {
    id: recipe._id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: recipe.tags,
    likes: recipe.likes,
    user: recipe.user
  }
}

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
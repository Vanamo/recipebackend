const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [],
  instructions: String,
  tags: [String],
  likedUsers: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

recipeSchema.statics.format = (recipe) => {
  return {
    id: recipe._id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: recipe.tags,
    likedUsers: recipe.likedUsers,
    user: recipe.user
  }
}

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
const mongoose = require('mongoose')

const recipeNoteSchema = new mongoose.Schema({
  content: String,
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

recipeNoteSchema.statics.format = (recipeNote) => {
  return {
    id: recipeNote._id,
    content: recipeNote.content,
    recipe: recipeNote.recipe,
    user: recipeNote.user
  }
}

const RecipeNote = mongoose.model('RecipeNote', recipeNoteSchema)

module.exports = RecipeNote
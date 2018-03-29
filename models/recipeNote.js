const mongoose = require('mongoose')

const recipeNoteSchema = new mongoose.Schema({
  content: String,
  recipeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

recipeNoteSchema.statics.format = (recipeNote) => {
  return {
    id: recipeNote._id,
    content: recipeNote.content,
    recipeid: recipeNote.recipeid,
    userid: recipeNote.userid
  }
}

const RecipeNote = mongoose.model('RecipeNote', recipeNoteSchema)

module.exports = RecipeNote
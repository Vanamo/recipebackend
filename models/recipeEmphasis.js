const mongoose = require('mongoose')

const recipeEmphasisSchema = new mongoose.Schema({
  content: Number,
  recipeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

recipeEmphasisSchema.statics.format = (recipeEmphasis) => {
  return {
    id: recipeEmphasis._id,
    content: recipeEmphasis.content,
    recipeid: recipeEmphasis.recipeid,
    userid: recipeEmphasis.userid
  }
}

const RecipeEmphasis = mongoose.model('RecipeEmphasis', recipeEmphasisSchema)

module.exports = RecipeEmphasis
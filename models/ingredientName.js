const mongoose = require('mongoose')

const ingredientNameSchema = mongoose.Schema({
  name: String
})

ingredientNameSchema.statics.format = (ingredientName) => {
  return {
    id: ingredientName._id,
    name: ingredientName.name
  }
}

const IngredientName = mongoose.model('IngredientName', ingredientNameSchema)

module.exports = IngredientName
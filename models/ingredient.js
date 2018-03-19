const mongoose = require('mongoose')

const ingredientSchema = mongoose.Schema({
  name: String
})

ingredientSchema.statics.format = (ingredient) => {
  return {
    id: ingredient._id,
    name: ingredient.name
  }
}

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient
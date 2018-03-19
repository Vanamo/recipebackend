const mongoose = require('mongoose')

const ingredientUnitSchema = mongoose.Schema({
  name: String
})

ingredientUnitSchema.statics.format = (ingredientUnit) => {
  return {
    id: ingredientUnit._id,
    name: ingredientUnit.name
  }
}

const IngredientUnit = mongoose.model('IngredientUnit', ingredientUnitSchema)

module.exports = IngredientUnit
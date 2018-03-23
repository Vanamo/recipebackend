const mongoose = require('mongoose')

const ingredientSchema = mongoose.Schema({
  quantity: Number,
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'IngredientUnit' },
  name: { type: mongoose.Schema.Types.ObjectId, ref: 'IngredientName' }
})

ingredientSchema.statics.format = (ingredient) => {
  return {
    id: ingredient._id,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    name: ingredient.name
  }
}

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient
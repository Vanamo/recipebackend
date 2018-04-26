const mongoose = require('mongoose')

const ingredientSchema = mongoose.Schema({
  quantity: Number,
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'IngredientUnit' },
  name: { type: mongoose.Schema.Types.ObjectId, ref: 'IngredientName' },
  subheading: String,
  type: String
})

ingredientSchema.statics.format = (ingredient) => {
  return {
    id: ingredient._id,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    name: ingredient.name,
    subheading: ingredient.subheading,
    type: ingredient.type
  }
}

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient
const ingredientsRouter = require('express').Router()
const Ingredient = require('../models/ingredient')

ingredientsRouter.get('/', async (request, response) => {
  const ingredients = await Ingredient.find({})
  response.json(ingredients.map(Ingredient.format))
})

ingredientsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingIngredient = await Ingredient.find({ name: body.name })
    if (existingIngredient.length > 0) {
      return response.status(400).json({ error: 'the ingredient already exists' })
    }

    const ingredient = new Ingredient({
      name: body.name
    })

    const savedIngredient = await ingredient.save()
    response.status(201).json(Ingredient.format(savedIngredient))
  } catch (excepion) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = ingredientsRouter
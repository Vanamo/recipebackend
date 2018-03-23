const ingredientNamesRouter = require('express').Router()
const IngredientName = require('../models/ingredientName')

ingredientNamesRouter.get('/', async (request, response) => {
  const ingredientNames = await IngredientName.find({})
  response.json(ingredientNames.map(IngredientName.format))
})

ingredientNamesRouter.get('/:id', async (request, response) => {
  try {
    const ingredientName = await IngredientName
      .findById(request.params.id)

    if (ingredientName) {
      response.json(IngredientName.format(ingredientName))
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

ingredientNamesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingIngredientName = await IngredientName.find({ name: body.name })
    if (existingIngredientName.length > 0) {
      return response.status(400).json({ error: 'the ingredient already exists' })
    }

    const ingredientName = new IngredientName({
      name: body.name
    })

    const savedIngredientName = await ingredientName.save()
    response.status(201).json(IngredientName.format(savedIngredientName))
  } catch (excepion) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = ingredientNamesRouter
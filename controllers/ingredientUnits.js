const ingredientUnitsRouter = require('express').Router()
const IngredientUnit = require('../models/ingredientUnit')

ingredientUnitsRouter.get('/', async (request, response) => {
  const ingredientUnits = await IngredientUnit.find({})
  response.json(ingredientUnits.map(IngredientUnit.format))
})

ingredientUnitsRouter.get('/:id', async (request, response) => {
  try {
    const ingredientUnit = await IngredientUnit
      .findById(request.params.id)

    if (ingredientUnit) {
      response.json(IngredientUnit.format(ingredientUnit))
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

ingredientUnitsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingIngredientUnit = await IngredientUnit.find({ name: body.name })
    if (existingIngredientUnit.length > 0) {
      return response.status(400).json({ error: 'the unit already exists' })
    }

    const ingredientUnit = new IngredientUnit({
      name: body.name
    })

    const savedIngredientUnit = await ingredientUnit.save()
    response.status(201).json(IngredientUnit.format(savedIngredientUnit))
  } catch (excepion) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = ingredientUnitsRouter
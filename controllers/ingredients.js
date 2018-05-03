const ingredientsRouter = require('express').Router()
const Ingredient = require('../models/ingredient')

ingredientsRouter.get('/', async (request, response) => {
  const ingredients = await Ingredient
    .find({})
    .populate('unit', { name: 1 })
    .populate('name', { name: 1 })
  response.json(ingredients.map(Ingredient.format))
})

ingredientsRouter.get('/:id', async (request, response) => {
  try {
    const ingredient = await Ingredient
      .findById(request.params.id)
      .populate('unit', { name: 1 })
      .populate('name', { name: 1 })

    if (ingredient) {
      response.json(Ingredient.format(ingredient))
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

ingredientsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    console.log('body', body)

    const ingredient = new Ingredient({
      quantity: body.quantity || 0,
      unit: body.unit || '5ae1dff6ea7268176b261cb3',   //tyhjän unitin id mlabissa
      name: body.name || '5ae1e046ea7268176b261cb4',  //tyhjän namen id mlabissa
      subheading: body.subheading,
      type: body.type
    })

    const savedIngredient = await ingredient.save()
    response.status(201).json(Ingredient.format(savedIngredient))
  } catch (excepion) {
    console.log('abc',exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = ingredientsRouter
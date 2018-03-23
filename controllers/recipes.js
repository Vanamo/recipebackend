const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')
const User = require('../models/user')
const Ingredient = require('../models/ingredient')
const Tag = require('../models/tag')
const jwt = require('jsonwebtoken')


recipesRouter.get('/', async (request, response) => {
  const recipes = await Recipe
    .find({})
    .populate({ path: 'user', model: 'User' })
    .populate({ path: 'tags', model: 'Tag' })
    
  response.json(recipes.map(Recipe.format))
})

recipesRouter.get('/:id', async (request, response) => {
  try {
    const recipe = await Recipe
      .findById(request.params.id)
      .populate({ path: 'user', model: 'User' })
      .populate({ path: 'tags', model: 'Tag' })

    if (recipe) {
      response.json(Recipe.format(recipe))
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.ingredients) {
      return response.status(400).json({ error: 'content missing' })
    }

    const existingTitle = await Recipe.find({ title: body.title })
    if (existingTitle.length > 0) {
      return response.status(400).json({ error: "title must be unique" })
    }

    if (!body.likes) {
      body.likes = 0
    }

    const user = await User.findById(decodedToken.id)

    const recipe = new Recipe({
      title: body.title,
      ingredients: body.ingredients,
      instructions: body.instructions,
      tags: body.tags,
      likes: body.likes,
      user: user._id
    })

    const savedRecipe = await recipe.save()

    user.recipes = user.recipes.concat(savedRecipe._id)
    await user.save()

    response.status(201).json(Recipe.format(recipe))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

recipesRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const recipe = await Recipe.findById(request.params.id)

    let authorizedUser = false
    if (!recipe.user ||
      decodedToken.id.toString() === recipe.user.toString()) {
      authorizedUser = true
    }
    console.log('user', authorizedUser)
    if (!request.token || !authorizedUser) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await Recipe.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipesRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const recipe = {
      title: body.title,
      ingredients: body.ingredients,
      instructions: body.instructions,
      tags: body.tags,
      likes: body.likes
    }

    console.log('id: ', request.params.id)
    const updatedRecipe = await Recipe.findByIdAndUpdate(request.params.id, recipe, { new: true })

    response.status(200).json(Recipe.format(updatedRecipe))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = recipesRouter
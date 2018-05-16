const recipeEmphasesRouter = require('express').Router()
const RecipeEmphasis = require('../models/recipeEmphasis')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

recipeEmphasesRouter.get('/', async (request, response) => {
  const recipeEmphases = await RecipeEmphasis
    .find({})

  response.json(recipeEmphases.map(RecipeEmphasis.format))
})

recipeEmphasesRouter.get('/:recipeid/:userid', async (request, response) => {
  try {
    const recipeEmphases = await RecipeEmphasis
      .find({
        recipeid: request.params.recipeid,
        userid: request.params.userid
      })

    const recipeEmphasis = recipeEmphases[0] //Only one emphasis per recipe per user

    if (recipeEmphasis) {
      response.json(RecipeEmphasis.format(recipeEmphasis)) 
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipeEmphasesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const recipeEmphasis = new RecipeEmphasis({
      content: body.content,
      userid: user._id,
      recipeid: body.recipeid
    })

    const savedRecipeEmphasis = await recipeEmphasis.save()

    response.status(201).json(RecipeEmphasis.format(recipeEmphasis))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

recipeEmphasesRouter.delete('/:recipeid/:userid', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    let authorizedUser = false
    if (decodedToken.id.toString() === request.params.userid.toString()) {
      authorizedUser = true
    }

    if (!request.token || !authorizedUser) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const recipeEmphases = await RecipeEmphasis
      .find({
        recipeid: request.params.recipeid,
        userid: request.params.userid
      })

    const recipeEmphasis = recipeEmphases[0]
    await RecipeEmphasis.findByIdAndRemove(recipeEmphasis._id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipeEmphasesRouter.put('/:recipeid/:userid', async (request, response) => {
  try {
    const body = request.body

    const recipeEmphasis = {
      content: body.content
    }
    const updatedRecipeEmphasis = await RecipeEmphasis
      .findByIdAndUpdate(request.body.id, recipeEmphasis, { new: true })

    response.status(200).json(RecipeEmphasis.format(updatedRecipeEmphasis))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = recipeEmphasesRouter
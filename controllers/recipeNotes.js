const recipeNotesRouter = require('express').Router()
const RecipeNote = require('../models/recipeNote')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

recipeNotesRouter.get('/:recipeid/:userid', async (request, response) => {
  try {
    const recipeNote = await RecipeNote
      .find({
        recipeid: request.params.recipeid,
        userid: request.params.userid
      })

    if (recipeNote) {
      response.json(RecipeNote.format(recipeNote))
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipeNotesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const recipe = await Recipe.findById(body.recipeid)

    const recipeNote = new RecipeNote({
      content: body.content,
      user: user._id,
      recipe: body.recipeid
    })

    const savedRecipeNote = await recipeNote.save()

    response.status(201).json(RecipeNote.format(recipeNote))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

recipeNotesRouter.delete('/:recipeid/:userid', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const recipeNote = await RecipeNote.findById(request.params.id)

    let authorizedUser = false
    if (!recipeNote.user ||
      decodedToken.id.toString() === recipeNote.user.toString()) {
      authorizedUser = true
    }
    console.log('user', authorizedUser)
    if (!request.token || !authorizedUser) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await RecipeNote.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

recipeNotesRouter.put('/:recipeid/:userid', async (request, response) => {
  try {
    const body = request.body

    const recipeNote = {
      content: body.content
    }

    const updatedRecipeNote = await RecipeNote
      .findByIdAndUpdate(request.params.id, recipeNote, { new: true })

    response.status(200).json(RecipeNote.format(updatedRecipeNote))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = recipeNotesRouter
const likesRouter = require('express').Router()
const Like = require('../models/like')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

likesRouter.get('/', async (request, response) => {
  const likes = await Like.find({})

  response.json(likes)
})

likesRouter.get('/:recipeid/:userid', async (request, response) => {
  try {
    const likes = await Like
      .find({
        recipeid: request.params.recipeid,
        userid: request.params.userid
      })

    if (likes) {
      response.json(likes[0]) //only one like per user      
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

likesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const recipe = await Recipe.findById(body.recipeid)

    const like = new Like({
      userid: user._id,
      recipeid: body.recipeid
    })

    const savedLike = await like.save()

    recipe.likedUsers = recipe.likedUsers.concat(savedLike.userid)
    await recipe.save()
    console.log('recipe', recipe)

    response.status(201).json(like)
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

likesRouter.delete('/:recipeid/:userid', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    let authorizedUser = false
    if (decodedToken.id.toString() === request.params.userid.toString()) {
      authorizedUser = true
    }

    if (!request.token || !authorizedUser) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const likes = await Like
    .find({
      recipeid: request.params.recipeid,
      userid: request.params.userid
    })

    const like = likes[0]
    const recipe = await Recipe.findById(request.params.recipeid)

    console.log('like', like)
    await Like.findByIdAndRemove(like._id)

    console.log('recipe', recipe)
    recipe.likedUsers = recipe.likedUsers.filter(lu => lu !== request.params.userid)
    await recipe.save()

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = likesRouter
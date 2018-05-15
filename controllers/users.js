const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('recipes')
    .populate('likedRecipes')

  response.json(users.map(User.format))
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.username.length < 3) {
      return response.status(400)
        .json({ error: 'the length of the username must be at least three characters' })
    }

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(User.format(savedUser))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})


usersRouter.put('/:userid', async (request, response) => {
  try {
    const body = request.body

    const user = {
      username: body.username,
      name: body.name,
      recipes: body.recipes,
      likedRecipes: body.likedRecipes,
      drawnRecipes: body.drawnRecipes
    }
    console.log('id', request.body.id)
    const updatedUser = await User
      .findByIdAndUpdate(request.body.id, user, { new: true })

    response.status(200).json(User.format(updatedUser))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = usersRouter
const tagsRouter = require('express').Router()
const Tag = require('../models/tag')

tagsRouter.get('/', async (request, response) => {
  const tags = await Tag.find({})
  response.json(tags.map(Tag.format))
})

tagsRouter.get('/:id', async (request, response) => {
  try {
    const tag = await Tag
      .findById(request.params.id)

    if (tag) {
      response.json(Tag.format(tag))
    } else {
      response.status(404).end
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

tagsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingTag = await Tag.find({ name: body.name })
    if (existingTag.length > 0) {
      return response.status(400).json({ error: 'the tag already exists' })
    }

    const tag = new Tag({
      name: body.name
    })

    const savedTag = await tag.save()
    response.status(201).json(Tag.format(savedTag))
  } catch (excepion) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = tagsRouter
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const recipesRouter = require('./controllers/recipes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const ingredientsRouter = require('./controllers/ingredients')
const ingredientUnitsRouter = require('./controllers/ingredientUnits')
const ingredientNamesRouter = require('./controllers/ingredientNames')
const tagsRouter = require('./controllers/tags')
const recipeNotesRouter = require('./controllers/recipeNotes')
const likesRouter = require('./controllers/likes')
const recipeEmphasesRouter = require('./controllers/recipeEmphases')
const middleware = require('./utils/middleware')

mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use(express.static('build'))
app.use('/api/recipes', recipesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/ingredientUnits', ingredientUnitsRouter)
app.use('/api/ingredientNames', ingredientNamesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/recipeNotes', recipeNotesRouter)
app.use('/api/likes', likesRouter)
app.use('/api/recipeEmphases', recipeEmphasesRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
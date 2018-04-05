const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  recipeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Like = mongoose.model('Like', likeSchema)

module.exports = Like
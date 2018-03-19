const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
  name: String
})

tagSchema.statics.format = (tag) => {
  return {
    id: tag._id,
    name: tag.name
  }
}

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
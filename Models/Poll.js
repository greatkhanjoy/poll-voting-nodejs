const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PollSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  options: {
    type: [
      {
        name: String,
        votes: Number,
      },
    ],
  },
  totalVote: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('Poll', PollSchema)

const express = require('express')
const Router = express.Router()
const {
  createPoll,
  storePoll,
  allPolls,
  getSinglePoll,
  vote,
} = require('../Controllers/PollController')

Router.route('/').get(allPolls)
Router.route('/create').get(createPoll).post(storePoll)
Router.route('/:id').get(getSinglePoll).post(vote)

module.exports = Router

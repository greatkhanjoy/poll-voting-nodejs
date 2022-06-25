const Poll = require('../Models/Poll')
const mongoose = require('mongoose')

const allPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
    res.render('polls', { polls, msg: req.msg })
  } catch (error) {
    console.log(error)
  }
}

const createPoll = async (req, res) => {
  res.render('create', { msg: req.msg })
}

const storePoll = async (req, res) => {
  const polls = await Poll.find()
  let { title, options, description } = req.body
  if (!title || !options || !description) {
    req.msg = 'All fields are required'
    return res.render('create', {
      msg: req.msg,
    })
  }
  options = options.map((option) => {
    return {
      name: option,
      votes: 0,
    }
  })

  const poll = new Poll({ title, description, options })
  await poll.save()
  req.msg = 'Poll created successfully'
  res.render('polls', { msg: req.msg, polls })
}

const getSinglePoll = async (req, res) => {
  const polls = await Poll.find()
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.msg = 'Invalid ID'
    return res.render('polls', { msg: req.msg, polls })
  }
  const poll = await Poll.findById(id)
  if (!poll) {
    req.msg = 'Poll not found'
    return res.render('polls', { msg: req.msg, polls })
  }
  let options = [...poll.options]
  let result = []
  options.forEach((option) => {
    let percentage = (option.votes / poll.totalVote) * 100
    result.push({
      ...option._doc,
      percentage: percentage ? percentage.toFixed(2) : 0,
    })
  })

  res.render('single', { poll, result })
}

const vote = async (req, res) => {
  const polls = await Poll.find()
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.msg = 'Invalid ID'
    return res.render('polls', { msg: req.msg, polls })
  }
  const poll = await Poll.findById(id)
  if (!poll) {
    req.msg = 'Poll not found'
    return res.render('polls', { msg: req.msg, polls })
  }

  let options = [...poll.options]
  let index = options.findIndex((option) => option.id === req.body.option)
  options[index].votes = options[index].votes + 1
  let totalVote = poll.totalVote + 1
  await Poll.findByIdAndUpdate(
    { _id: poll._id },
    { $set: { options, totalVote } }
  )
  res.redirect(`/polls/${id}`)
}

module.exports = { createPoll, storePoll, allPolls, getSinglePoll, vote }

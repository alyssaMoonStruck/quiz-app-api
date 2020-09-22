const express = require('express')
const passport = require('passport')
const Questions = require('../models/question')
const errors = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')

const handle404 = errors.handle404
const requireOwnership = errors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.get('/userquestions',requireToken, (req, res, next) => {
  Questions.find({ owner: req.user.id })
    .then(questions => {
      return questions.map(question => question.toObject())
    })
    .then(questions => res.status(200).json({ questions: questions }))
    .catch(next)
})

// INDEX
router.get('/questions', (req, res, next) => {
  Questions.find()
    .then(questions => {
      return questions.map(question => question.toObject())
    })
    .then(questions => res.status(200).json({ questions: questions }))
    .catch(next)
})

// SHOW
router.get('/questions/:id', requireToken, (req, res, next) => {
  Questions.findById(req.params.id)
    .then(handle404)
    .then(question => res.status(200).json({ question: question.toObject() }))
    .catch(next)
})

// CREATE:
router.post('/questions', requireToken, (req, res, next) => {
  req.body.question.owner = req.user.id

  Questions.create(req.body.question)
    .then(question => {
      res.status(201).json({ question: question.toObject() })
      //res.status(201).json({ snippet: snippet.toObject() })
    })
    .catch(next)
})

// UPDATE
router.patch('/questions/:id', requireToken, removeBlanks, (req, res, next) => {
  
  req.body.question.owner = req.user.id
  console.log(req.body)

  Questions.findById(req.params.id)
    .then(handle404)
    .then(question => {
      requireOwnership(req, question)
      return question.updateOne(req.body.question)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY

router.delete('/questions/:id', requireToken, (req, res, next) => {
  Questions.findById(req.params.id)
    .then(handle404)
    .then(question => {
      requireOwnership(req, question)
      question.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})


router.get('/questions/quiz/:num', requireToken, (req, res, next) => {
    Questions.aggregate().sample(parseInt(req.params.num))
      .then(handle404)
      .then(questions => res.status(200).json({ questions: questions }))
      .catch(next)
  })

module.exports = router
const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [String],
        required: true
    },
    correct: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
}, {
  timestamps: true
})

module.exports = mongoose.model('Question', QuestionSchema)

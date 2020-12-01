import Question from '../models/Question'
import Answer from '../models/Answer'

exports.GetContents = async (req, res) => {
  // TODO : get questions from mongodb and return to frontend
  Question.find({}, (err, docs) => {
    if (err) {
      res.status(403).send({
        message: 'error',
        content: []
      })
      return
    }
    res.status(200).send({
      message: 'success',
      content: docs
    })
  })
}

exports.CheckAns = async (req, res) => {
  // TODO : get answers from mongodb,
  // check answers coming from frontend and return score to frontend
  Answer.find({}, (err, docs) => {
    if (err) {
      res.status.send({
        message: 'error',
        score: -1
      })
      return
    }
    let score = 0
    for (let answer of docs) {
      const index = answer.questionID - 1
      const correct_answer = answer.answer
      const received_answer = parseInt(req.body.ans[index])
      if (correct_answer === received_answer)
        score += 1
    }
    res.status(200).send({
      message: 'success',
      score
    })
  })
}

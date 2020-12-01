import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

function Question() {
  const [complete, setComplete] = useState(false)  // true if answered all questions
  const [contents, setContents] = useState([])     // to store questions
  const [ans, setAns] = useState([])               // to record your answers
  const [scores, setScore] = useState(0)            // Your score
  const [current_question, setCurrentQuestion] = useState(0) // index to current question

  const next = async () => {
    if (current_question === contents.length - 1) {
      const {
        data: {score}
      } = await instance.post('/checkAns', { ans })
      setScore(score)
      setComplete(true)
      return
    }
    setCurrentQuestion(current => current + 1)
    // TODO : switch to the next question,
    // and check answers to set the score after you finished the last question
  }

  const choose = (e) => {
    // TODO : update 'ans' for the option you clicked
    const choice = parseInt(e.target.name)
    setAns(current => {
      const newAns = [...ans]
      newAns[current_question] = choice
      return newAns
    })
  }

  const getQuestions = async () => {
    const {
      data: {content}
    } = await instance.get('/getContents')
    setContents(content)
    setCurrentQuestion(0)
    setAns(Array(content.length).fill(0))
  }

  useEffect(() => {
    if (!contents.length)
      getQuestions()
  }, [])

  // TODO : fill in the rendering contents and logic
  return (
    <div id="quiz-container">
      {contents.length ?
        <React.Fragment>
          <div id="question-box">
            <div className="question-box-inner">
              Question {contents[current_question].questionID} of {contents.length}
            </div>
          </div>

          <div id="question-title">
            {complete ? `Your Score: ${scores} / ${contents.length}` : contents[current_question].question}
          </div>

          {complete ? <div></div> : 
          <div id={complete ? "" : "options"}>
            {complete ? "" : contents[current_question].options.map((option, i) =>
              <div className="each-option" key={`q${current_question + 1}_${i+1}`}>
              <input 
                type="radio" 
                id={`q${current_question + 1}_${i+1}`}
                name={i+1}
                checked={ans[current_question] === i+1}
                onChange={choose}
              />
              <span>{option}</span>
            </div>
            )}
          </div>}
          
          {complete ? <div></div> :
          <div id={complete ? "" : "actions"} onClick={next}>
            {complete ? "" : "NEXT"}
          </div>}
        </React.Fragment>
        : <React.Fragment></React.Fragment>
      }
    </div>
  )
}

export default Question

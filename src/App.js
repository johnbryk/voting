import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'
import Button from './Button.js'

const url = '/api/data'

const App = () => {
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState([])

  const voted = localStorage.voted ? localStorage.voted : false
  const totals = choices.map(choice => choice.total)
  const totalVotes = totals.reduce((prev, curr) => prev+curr, 0)
  const percents = totals.map(total => (total / totalVotes)
    .toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}))

  useEffect(() => {
    axios
      .get(url)
      .then(res => {
        setQuestion(res.data.question)
        setChoices(res.data.choices)
      })
  }, [])

  const onClick = (i) => {
    axios
      .post(url, {vote: i})
      .then(res => {
        setChoices(res.data.choices)
        localStorage.voted = true
      })
  }

  return (
    <div>
      <div className='question'>
        {question.toUpperCase()}
      </div>
      <div className='buttons'>
        {choices.map((choice, vote) => (
          <Button key={vote} choice={choice} onClick={voted ? null : () => {onClick(vote)}} percent={percents[vote]} voted={voted}/>
        ))}
      </div>
    </div>
  )
}

export default App

// axios sends our get and post requests
import axios from 'axios'
// handling state and running effects on load/when some values change
import { useState, useEffect } from 'react'
import './App.css'
// I extracted the button to its own component
import Button from './Button.js'

// both get and post are directed to this url
const url = '/api/data'

// our app
const App = () => {
  // this feels self-explanatory
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState([])
  const [voted, setVoted] = useState(false)

  // totals just extracts the vote total for each choice
  const totals = choices.map(choice => choice.total)
  // this is the total number of votes--this just adds the totals together
  const totalVotes = totals.reduce((prev, curr) => prev+curr, 0)
  // this computes and formats the percent of votes for each choice
  const percents = totals.map(total => (total / totalVotes)
    .toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}))

  // when we load the page, get the data from the server
  // then extract the question and choices from the data
  // we don't use the date here. we could have. I just didn't
  useEffect(() => {
    axios
      .get(url)
      .then(res => {
        setQuestion(res.data.question)
        setChoices(res.data.choices)
      })
  }, [])

  // cick handler: sends a post request
  // the post request is this simple object: {vote: #}
  // when we get a response, we update choices (which really just updates the vote totals)
  // and then we set voted as true, which affects what they see/whether they can click the buttons
  const onClick = (i) => {
    axios
      .post(url, {vote: i})
      .then(res => {
        setChoices(res.data.choices)
        setVoted(true)
      })
  }

  // here's the JSX
  return (
    <div>
      {/* the question */}
      <div className='question'>
        {question.toUpperCase()}
      </div>
      {/* the buttons */}
      <div className='buttons'>
        {/* maps eac choice to a button; the button needs choice for image and text;
        the callback function does nothing if they've voted; percent is percent;
        voted is passed so we know how to render the buttons--show percents or not */}
        {choices.map((choice, vote) => (
          <Button key={vote} choice={choice} onClick={voted ? null : () => {onClick(vote)}} percent={percents[vote]} voted={voted}/>
        ))}
      </div>
    </div>
  )
}

export default App

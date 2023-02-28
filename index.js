// this is our app
const express = require('express')
const app = express()

// this tells app to direct all requests to the build directory
// e.g., the url http://www.domain.com/somefile.txt is directed
// the file to root/build/somefile.txt
app.use(express.static('build'))

// this lets the app send json responses
app.use(express.json())

// this will handle reading/writing to our json file
const fs = require('fs')

let history = []
// history is the voting history
// it contains objects formatted as:
//
// {
//   id: the date the question was/will be asked, a string
//   question: the question of the day, a string
//   choices: an array containing the choices to vote on
// }
//
// each choice is itself an object formatted as:
//
// {
//   img: image filename
//   txt: the text to accompany each image
//   total: the vote total
// }

// we ready the file and save it to history
// note: this runs ONCE: when the server starts
fs.readFile(
  './history.json',
  (_err, data) => {
    history = JSON.parse(data)
  }
)

// this is how we handle get requests, which happen when the user loads the page
// my code checks which date it is and then returns the data for that date
app.get('/api/data', (_req, res) => {
  // what's today?
  const date = new Date().toISOString().substring(0, 10)
  // find the data for that day (id is date)
  res.json(history.find(data => data.id === date))
})

// this is how we handle post requests, which happens when the user votes
app.post('/api/data', (req, res) => {
  // req is the request from the user, req.body is what they send
  // the frontend app send a simple object: { vote: # }
  // # is 0 or 1
  const body = req.body
  console.log(body)

  // the user's vote
  const vote = body.vote
  // today's date
  const date = new Date().toISOString().substring(0, 10)
  // find the data for today
  const data = history.find(data => data.id === date)
  // get the choices for today
  const choices = data.choices
  // update the choices with the user's vote
  const updatedChoices = choices.map(
    (choice, i) => vote === i ? {...choice, total: choice.total + 1} : choice
    // this code deserves some explanation
    // first, we can use two parameters in the map callback function
    // the first parameter represents the item in the array, the second its index
    // a user's vote is the index of the choice they selected in choices
    // we're using the ternary operator a ? b : c to determine whether to change the choice or not
    // if the vote is the index, then change the choice; otherwise don't
    // we only need to udpate the total for the choice, which is what {...choice, total:choice.total+1} means
    // {...choice} alone would create an object that's a copy of choice
    // putting total:choice.total+1 means we'll change that one value--increase the total votes by 1
  )

  // this is similar to the updatedChoices thing above--we're updating today's choices
  history = history.map(
    data => data.id === date ? {...data, choices: updatedChoices} : data
  )
  
  // we update the json file--this doesn't actually do much because we can't overwrite our json file on github
  fs.writeFile(
    './history.json',
    JSON.stringify(history, null, 2),
    (err) => {console.log(err)})

  // and this sends today's updated data to the user
  res.json({...data, choices: updatedChoices})
})

// this tells the app to listen for users, either on a port assigned by our host or on 3000
const PORT = process.env.PORT || 3000
app.listen(PORT)

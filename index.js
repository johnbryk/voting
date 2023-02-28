const express = require('express')
const app = express()
app.use(express.static('build'))
app.use(express.json())

const http = require('http')
const server = http.createServer(app)

const fs = require('fs')

let history = []
fs.readFile(
  './history.json',
  (_err, data) => {
    history = JSON.parse(data)
  }
)

app.get('/api/data', (_req, res) => {
  const date = new Date().toISOString().substring(0, 10)
  res.json(history.find(data => data.id === date))
})

app.post('/api/data', (req, res) => {
  const body = req.body
  console.log(body)

  const vote = body.vote
  const date = new Date().toISOString().substring(0, 10)
  const data = history.find(data => data.id === date)
  const choices = data.choices
  const updatedChoices = choices.map(
    (choice, i) => vote === i ? {...choice, total: choice.total + 1} : choice
  )

  history = history.map(
    data => data.id === date ? {...data, choices: updatedChoices} : data
  )
  fs.writeFile(
    './history.json',
    JSON.stringify(history, null, 2),
    (err) => {console.log(err)})

  res.json({...data, choices: updatedChoices})
})

const PORT = process.env.PORT || 3000
server.listen(PORT)
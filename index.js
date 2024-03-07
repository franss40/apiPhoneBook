require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require('./models/phonebook')

const app = express()
app.use(express.static("dist"))

require("dotenv").config()
const cors = require("cors")
app.use(cors())

app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.res(req, res, ":res[header]"),
      JSON.stringify(req.body),
    ].join(" ")
  })
)

/* let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
] */

// rutas
app.get("/info", (req, res) => {
  Person.find({}).then((result) => {
    const total = result.length
    const html = `<p>Phonebook has info for ${total} people</p><p>${new Date()}</p>`
    res.send(html)
  })
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  Person.findById(id)
    .then((result) => {
      res.json(result)
    })
    .catch(error => {
      res.status(404).end()
    })
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id !== id)
  res.status(204).end()
})

app.post("/api/persons/", (req, res) => {
  const body = req.body

  const istherename = body.hasOwnProperty("name")
  const istherenumber = body.hasOwnProperty("number")

  if (!istherename || !istherenumber) {
    return res.status(400).json({ error: "missing body" })
  }
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" })
  }
  /* const findName = persons.find((person) => person.name === body.name)
  if (findName) {
    return res.status(400).json({ error: "name must be unique" })
  } */

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(result => {
    res.json(result)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

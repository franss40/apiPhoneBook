require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require('./models/phonebook')

const app = express()
app.use(express.static("dist"))

require("dotenv").config()
const cors = require("cors")
const { SchemaTypes } = require("mongoose")
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

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      next(error)
    })
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.post("/api/persons/", (req, res, next) => {
  const body = req.body

  const istherename = body.hasOwnProperty("name")
  const istherenumber = body.hasOwnProperty("number")

  if (!istherename || !istherenumber) {
    return res.status(400).json({ error: "missing body" })
  }
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" })
  }

  Person.findOne({name: body.name})
    .then(result => {
      if (!result) {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person.save().then((result) => {
          res.json(result)
        })
      } else {
        const person = {
          name: body.name,
          number: body.number,
        }
        const id = result._id.toString()
        console.log('id', id)
        Person.findByIdAndUpdate(id, person, { new: true })
          .then((result2) => {
            res.json(result2)
          })
          .catch((error) => next(error))
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const istherename = body.hasOwnProperty("name")
  const istherenumber = body.hasOwnProperty("number")

  if (!istherename || !istherenumber) {
    return res.status(400).json({ error: "missing body" })
  }
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

const unkKnownEndPoint = (req, res) => {
  res.status(404).send({error: 'unKnown endPoint'})
}
app.use(unkKnownEndPoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

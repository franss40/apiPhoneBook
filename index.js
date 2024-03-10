require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')

const app = express()
app.use(express.static('dist'))

require('dotenv').config()
/* const { SchemaTypes } = require('mongoose') */
app.use(cors())

app.use(express.json())

function configurationMorgan(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    tokens.res(req, res, ':res[header]'),
    JSON.stringify(req.body),
  ].join(' ')
}
app.use(morgan(configurationMorgan))

// rutas
app.get('/info', (req, res, next) => {
  Person.find({})
    .then(result => {
      const total = result.length
      const html = `<p>Phonebook has info for ${total} people</p><p>${new Date()}</p>`
      res.send(html)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
  const { name, number } = req.body

  Person.findOne({ name })
    .then(result => {
      if (!result) {
        const person = new Person({
          name,
          number,
        })
        person.save()
          .then(savePerson => res.json(savePerson))
          .catch(error => next(error))
      } else {
        const person = {
          name,
          number,
        }
        // eslint-disable-next-line no-underscore-dangle
        const id = result._id.toString()

        Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
          .then(updatePerson => res.json(updatePerson))
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req
  const { id } = req.params

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

const unkKnownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unKnown endPoint' })
}
app.use(unkKnownEndPoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(404).json({ error: error.message })
  }
  return next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

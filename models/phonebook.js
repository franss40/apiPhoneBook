/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error conecting to MongoDB', error.message)
  })

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'minimum required 3 characters'],
    required: true,
  },
  number: {
    type: String,
    minLength: [8, 'minimum required 8 characters'],
    required: true,
    validate: {
      validator: v => /\d{2,3}-\d/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', bookSchema)
module.exports = Person

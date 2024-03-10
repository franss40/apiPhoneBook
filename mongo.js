const mongoose = require('mongoose')

const argumentsLength = process.argv.length

if (argumentsLength < 3 || argumentsLength > 5) {
  console.log('data missing')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://franss40:${password}@cluster0.lp4ljwc.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const bookShema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', bookShema)

if (argumentsLength === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })
  person.save().then(() => {
    console.log('person save')
    mongoose.connection.close()
  })
}

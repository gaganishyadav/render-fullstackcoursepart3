const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./module/connection')
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))

app.get('/',(request,response) => {
    response.send("<a href='/api/phone'>Phonebook</a><br/><a href='/info'>Info</a>")
})

app.get('/info',(request,response) => {
  Person.find({}).then(result=>
    response.send(`<p>Phonebook has info for ${result.length} people </p> <p>${Date()}</p>`)
  )
})

app.get('/api/phone',(request,response) => {
  Person.find({}).then(result=>
    response.json(result)
  )
})

app.get('/api/phone/:id',(request,response,next) => {
  Person.findById(request.params.id).then(result=>{
    if(result)
      response.json(result)
    else
      response.status(404).end()
  })
  .catch(error=>next(error))
})

app.delete('/api/phone/:id',(request,response,next) => {
  Person.findByIdAndDelete(request.params.id).then(result=>
    response.status(204).end()
  )
  .catch(error=>next(error)
  )
})

app.post('/api/phone',(request,response,next)=>{
    const newdata = request.body
    const person = new Person({
        name:newdata.name,
        number:newdata.number
    })
    person.save().then(result=>
      response.json(result)
    )
    .catch(error=>next(error))
})

app.put('/api/phone/:id',(request,response,next) => {
  const newdata=request.body
  Person.findByIdAndUpdate(request.params.id,newdata,{new:true, runValidators: true, context: 'query'})
    .then(result=>response.json(result))
    .catch(error=>next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name==='ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port)
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response) => {
    response.send("<a href='/api/phone'>Phonebook</a><br/><a href='/info'>Info</a>")
})

app.get('/info',(request,response) => {
    response.send(`<p>Phonebook has info for ${data.length} people </p> <p>${Date()}</p>`)
})

app.get('/api/phone',(request,response) => {
    response.send(data)
})

app.get('/api/phone/:id',(request,response) => {
    const id=request.params.id
    const res = data.find(i=>i.id===id)
    res?response.json(res):response.status(404).end()
})

app.delete('/api/phone/:id',(request,response) => {
    const id=request.params.id
    data = data.filter(i=>i.id!==id)
    response.status(204).end()
})

app.post('/api/phone',(request,response)=>{
    const newdata = request.body
    
    if (!newdata.name || !newdata.number){
        return response.status(400).json({ 
          error: 'fields missing' 
        })
    }

    if (data.map(i=>i.name).includes(newdata.name)){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    const contact = {
        id:Math.floor(Math.random()*100).toString(),
        name:newdata.name,
        number:newdata.number
    }
    data = data.concat(contact)
    response.json(contact)
})

app.put('/api/phone/:id',(request,response) => {
  const newdata=request.body
  const id=request.params.id
  data = data.map(i=>i.id===id?newdata:i)
  console.log(id,'id')
  console.log(newdata,'newdata')
  response.json(data)
})

const port = process.env.PORT || 3001
app.listen(port)

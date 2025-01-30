const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate:{
            validator: v=>/\d{2,3}-\d+/.test(v),
            message: 'Invalid phone number'
        }
    }
    }, {toJSON:{
        transform: (document,returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    }}
)

module.exports = mongoose.model('Person', personSchema)
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })

// citing stackoverflow for multiple validators in one field https://stackoverflow.com/questions/24219226/add-more-than-one-validate-in-mongoose
const isTooShort = function(val) {
    console.log(val.length)
    return val.length >= 9
}

const wrongPhoneFormat = function(val) {
    return /\d{2,3}-\d{5,}/.test(val)
}

const manyValidators = [
    { validator: isTooShort, message: 'phone number is too short'},
    { validator: wrongPhoneFormat, message: 'not a valid phone number format'}
]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3, 
        required: true
    },
    number: {
        type: String,
        validate: manyValidators,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
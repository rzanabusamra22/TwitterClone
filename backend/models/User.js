const mongoose = require('mongoose')
const { isEmail } = require('validator');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Please enter an email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    }
}, { timestamps: true })


//creating the model
const User = mongoose.model('User', userSchema);


//exporting the model to use mongoose functions 
module.exports = User
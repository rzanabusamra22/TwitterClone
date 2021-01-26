const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

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
    },
    avatar: {
        type: String,
        default:
            "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png",
    },
    bio: {
        type: String,
    },
    website: {
        type: String,
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    tweets: [{ type: mongoose.Schema.ObjectId, ref: "Tweet" }],
    likes: [{ type: mongoose.Schema.ObjectId, ref: "Tweet" }],
    bookmarks: [{ type: mongoose.Schema.ObjectId, ref: "Tweet" }],
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//creating the model
const User = mongoose.model('User', userSchema);


//exporting the model to use mongoose functions 
module.exports = User
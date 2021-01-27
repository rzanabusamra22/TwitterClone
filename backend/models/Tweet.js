const mongoose = require('mongoose')

const tweet = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    text: { type: String, maxlength: 280 },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    retweets: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    retweet:{ type: mongoose.Schema.ObjectId, ref: "Tweet" },
    parent: { type: mongoose.Schema.ObjectId, ref: "Tweet" },
    children: [{ type: mongoose.Schema.ObjectId, ref: "Tweet" }],
}, { timestamps: true })

//creating the model
const Tweet = mongoose.model('Tweet', tweet);


//exporting the model to use mongoose functions 
module.exports = Tweet
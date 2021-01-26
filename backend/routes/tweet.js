const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Tweet = require('../models/Tweet')
const auth = require('../middlewares/auth')


router.post('/getThread', async (req, res) => {
    const tweet = await Tweet.findById(req.body.tweet.id)
        .populate({
            path: "children",
            populate: {
                path: "user",
            },
        })
        .populate({
            path: "parent",
            populate: {
                path: "user",
            },
        })
        .populate({
            path: "user",
        })
    if (!tweet) {
        res.status(404).json({
            message: `No tweet found for id ${req.body.tweet.id}`,
        });
    } else {
        res.status(200).json({ success: true, data: tweet });
    }
})

router.post('/postTweet', async (req, res) => {
    const { user, text } = req.body;
    const userID = user.id;
    try {
        let tweet = await Tweet.create({ text, user: userID });
        await User.findByIdAndUpdate(userID, {
            $push: { tweets: tweet._id },
        });
        tweet = await tweet
            .populate({ path: "user", select: "avatar username" })
            .execPopulate();
        res.status(200).json({ success: true, data: tweet });
    }
    catch (err) {
        res.status(404).json({ sucess: false, err })
    }
});

router.post('/commentTweet', async (req, res) => {
    const { user, text, parentTweetID } = req.body;
    const userID = user.id;
    try {
        let tweet = await Tweet.create({ text, user: userID, parent: parentTweetID });
        await User.findByIdAndUpdate(userID, {
            $push: { tweets: tweet._id },
        });
        await Tweet.findByIdAndUpdate(parentTweetID, {
            $push: { children: tweet._id },
        });
        tweet = await tweet
            .populate({ path: "user", select: "avatar username" })
            .execPopulate();
        res.status(200).json({ success: true, data: tweet });
    }
    catch (err) {
        res.status(404).json({ sucess: false, err })
    }
});

router.post('/:id/follow', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({
            message: `No user found for id ${req.params.id}`,
        });
    }
    else if (req.params.id === req.body.user.id) {
        res.status(403).json({ message: "You can't unfollow/follow yourself" });
    }
    else if (user.followers.includes(req.body.user.id)) {
        await User.findByIdAndUpdate(req.params.id, {
            $pull: { followers: req.body.user.id }
        });
        await User.findByIdAndUpdate(req.body.user.id, {
            $pull: { following: req.params.id }
        });
        res.status(200).json({ success: true, msg: 'unfollowed' });
    }
    else {
        await User.findByIdAndUpdate(req.params.id, {
            $push: { followers: req.body.user.id }
        });
        await User.findByIdAndUpdate(req.body.user.id, {
            $push: { following: req.params.id }
        });
        res.status(200).json({ success: true, msg: 'followed' });
    }
})

router.post('/following', async (req, res) => {
    const user = await User.findById(req.body.user.id)
        .populate({ path: "following" })
    if (!user) {
        res.status(404).json({
            message: `No user found for id ${req.body.user.id}`,
        });
    } else {
        res.status(200).json({ success: true, data: user.following });
    }
})

router.post('/editBio', async (req, res) => {
    const { bio } = req.body
    const user = await User.findByIdAndUpdate(
        req.body.user.id,
        {
            $set: { bio },
        })
    res.status(200).json({ success: true, data: { newBio: bio } });
})


module.exports = router


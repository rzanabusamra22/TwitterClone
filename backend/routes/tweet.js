const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Tweet = require('../models/Tweet')
const auth = require('../middlewares/auth')

router.post('/feed', async (req, res) => {
    const user = await User.findById(req.body.user.id);
    if (!user) {
        res.status(401).json({
            message: `No user found for id ${req.params.id}`,
        });
    }
    const following = user.following;
    const users = await User.find()
        .where("_id")
        .in(following.concat([user.id]))
        .exec();
    const tweetsID = users.map((user) => user.tweets);
    const tweets = await Tweet.find()
        .populate({
            path: "children",
            select: "text",
            populate: { path: "user", select: "avatar username" },
        })
        .populate({ path: "user", select: "avatar username" })
        .sort("-createdAt")
        .where("_id")
        .in(tweetsID.map((tweet) => tweet[0]))
        .exec();

    res.status(200).json({ success: true, data: tweets });
})

router.get('/getThread/:id', async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
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
router.post('/likes', async (req, res, next) => {
    // make sure that the post exists
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next({
            message: `No post found for id ${req.params.id}`,
            statusCode: 404,
        });
    }

    if (post.likes.includes(req.user.id)) {
        const index = post.likes.indexOf(req.user.id);
        post.likes.splice(index, 1);
        post.likesCount = post.likesCount - 1;
        await post.save();
    } else {
        post.likes.push(req.user.id);
        post.likesCount = post.likesCount + 1;
        await post.save();
    }

    res.status(200).json({ success: true, data: {} });
});



module.exports = router


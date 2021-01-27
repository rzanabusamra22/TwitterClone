const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middlewares/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.get('/auth', auth, (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        success: true
    })
})


router.post('/signup', async (req, res) => {
    try {
        // const salt = await bcrypt.genSalt(10)
        // const hashedPw = await bcrypt.hash(req.body.password, salt)
        // const user = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: hashedPw
        // })
        // await user.save()
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        const token = await jwt.sign({ _id: user._id }, process.env.secret)
        res.header("Authorization", token).status(201).json({
            success: true,
            user,
            token
        })
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) throw Error("User doesn't exist")
        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {
            const token = await jwt.sign({ _id: user._id }, process.env.secret)
            res.header('Authorization', token).status(201).json({
                success: true,
                token,
                user
            })
        } else {
            throw Error("Incorrect password")
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
})

router.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
        res.status(401).json({
            message: `No user found`,
        });
    } else {
        res.status(200).json({ success: true, data: user });
    }
})

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

router.post('/followers', async (req, res) => {
    const user = await User.findById(req.body.user.id)
        .populate({ path: "followers" })
    if (!user) {
        res.status(404).json({
            message: `No user found for id ${req.body.user.id}`,
        });
    } else {
        res.status(200).json({ success: true, data: user.followers });
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

router.post('/editWebsite', async (req, res) => {
    const { website } = req.body
    const user = await User.findByIdAndUpdate(
        req.body.user.id,
        {
            $set: { website },
        })
    res.status(200).json({ success: true, data: { newWebsite: website } });
})

router.post('/updateAvatar', async (req, res) => {
    const { avatar } = req.body
    const user = await User.findByIdAndUpdate(
        req.body.user.id,
        {
            $set: { avatar },
        })
    res.status(200).json({ success: true, data: { newavatar: avatar } });
})


module.exports = router


const User = require('../models/User')
const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization') 
    if (token) {
      const decoded = await jwt.verify(token, process.env.secret) 
      const user = await User.findOne({ _id: decoded._id })
      req.user = user
      next()
    } else {
      throw Error
    }
  } catch {
    res.status(401).json({ success: false, text: 'you must be logged in' })
  }
}

module.exports = auth
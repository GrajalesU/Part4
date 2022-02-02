const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (req, res, next) => {
  const { body } = req

  const saltRounds = 10
  if (body.password.length < 3) {
    return next(
      {
        name: 'ValidationError',
        message: 'The password length must be greater than or equal to 3',
      },
    )
  }
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  return res.json(savedUser)
})

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  res.json(users)
})

module.exports = userRouter

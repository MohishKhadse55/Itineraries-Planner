const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Itinerary = require('../models/itinerary')

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const user = await User
    .findById(id)

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    email: body.email,
    googleId: '',
    firstName: body.firstName,
    lastName: body.lastName,
    imgUrl: body.imgUrl,
    passwordHash,
    favs: [],
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  const userId = request.params.id
  const user = await User.findById(userId)
  const itineraryId = request.body.itineraryId
  const itinerary = await Itinerary.findById(itineraryId)

  if (!user || !itinerary) {
    response.status(400).json({ error: 'User or itinerary not exist' })
  }

  user.username = request.body.username

  await itinerary.save()
  const updatedUser = await user.save()

  response.json(updatedUser)
})

module.exports = usersRouter

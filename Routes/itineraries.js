const jwt = require('jsonwebtoken')
const itinerariesRouter = require('express').Router()
const Itinerary = require('../models/itinerary')
const City = require('../models/city')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

itinerariesRouter.get('/', async (request, response) => {
  const itineraries = await Itinerary
    .find({}).populate('city', { name: 1, id: 1, country: 1 }).populate('activities')

  response.json(itineraries)
})

itinerariesRouter.get('/:city', async (request, response) => {
  const cityName = request.params.city
  console.log(typeof cityName)
  const city = await City.findOne({ name: cityName })
  const itinerariesOf = await Itinerary
    .find({ city: city._id })
    .populate('activities')
    .populate({
      populate: {
        path: 'user'
      }
    })
    .populate({
      populate: {
        path: 'itinerary',
        populate: 'city'
      }
    })

  response.json(itinerariesOf)
})

itinerariesRouter.post('/', async (request, response) => {
  const body = request.body
  const city = await City.findOne({ name: body.city })

  if (!city) {
    response.status(400).json({ error: 'city not exist' })
  }

  const itinerary = new Itinerary({
    name: body.name,
    city: city._id,
    user: body.user,
    imgUrl: body.imgUrl,
    userPhotosUrls: body.userPhotosUrls,
    rating: body.rating,
    duration: body.duration,
    price: body.price,
    hashtags: body.hashtags,
    activities: [],
    favs: []
  })

  const savedItinerary = await itinerary.save()
  response.json(savedItinerary)
})

module.exports = itinerariesRouter

const config = require('./utils/config')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const countriesRouter = require('./Routes/countries')
const citiesRouter = require('./Routes/cities')
const itinerariesRouter = require('./Routes/itineraries')
const activitiesRouter = require('./Routes/activities')
const usersRouter = require('./Routes/users')
const loginRouter = require('./Routes/login')

const middleware = require('./utils/middleware')

console.log(config.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

// app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/countries', countriesRouter)
app.use('/api/cities', citiesRouter)
app.use('/api/itineraries', itinerariesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

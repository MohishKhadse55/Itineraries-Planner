const config = require('./utils/config')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const countriesRouter = require('./controllers/countries')
const citiesRouter = require('./controllers/cities')
const itinerariesRouter = require('./controllers/itineraries')
const activitiesRouter = require('./controllers/activities')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

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
// app.use(express.static('build'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/countries', countriesRouter)
app.use('/api/cities', citiesRouter)
app.use('/api/itineraries', itinerariesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.get('/*', (req, res) => {
  let url = path.join(__dirname, '/', 'build', 'index.html');
  if (!url.startsWith('/app/')) // we're on local windows
    url = url.substring(1);
  res.sendFile(url);
});

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
